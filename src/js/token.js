import OSS from 'ali-oss'
import { ElMessage } from 'element-plus'
import { getToken } from '../api/token.js'
import { storeRootPath, ossClient, callbackParam, uploadFileListResponse, fileList, tokenBody, selectResourceUUID } from './state.js'
import { relevanceFile } from './resource.js'

const handleGetToken = async () => {
  const res = await getToken()
  ElMessage.success('token获取成功')
  tokenBody.value = res
  callbackParam.value = res.callbackParam
  storeRootPath.value = res.storePath.slice(0, res.storePath.lastIndexOf('/{fileName}'));  // 文件上传路径
  // console.log('Token',res);
}

const creatOssClient = () => {
  if (!tokenBody.value) {
    return ElMessage.warning('请先获取token')
  }
  ossClient.value = new OSS({
    region: tokenBody.value.region, // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
    accessKeyId: tokenBody.value.accessKeyID, // 确保已设置环境变量OSS_ACCESS_KEY_ID。
    accessKeySecret: tokenBody.value.secretAccessKey, // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
    bucket: tokenBody.value.cloudBucketName, // 示例：'my-bucket-name'，填写存储空间名称。
    stsToken: tokenBody.value.sessionToken,
    storePath: tokenBody.value.storePath
  });
  // ElMessage.success('ossClient创建成功')
  // console.log('OssClient',ossClient.value);
}

let timer = null

const handleChange = (e) => {
  fileList.value.push(e)
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    clearTimeout(timer)
    timer = null
    startUpload()
  }, 3000)
}

let uploadIdx = 0
const MAX_UPLOAD_NUM = 16    // 一次性上传、关联很多文件都会报错，所以对图片文件分批上传、合并

const startUpload = async () => {
  if (!selectResourceUUID.value) {
    return ElMessage.warning('请选择resource，如果没有先创建')
  }
  if (!ossClient.value) {
    creatOssClient()
  }
  uploadFile(fileList.value[uploadIdx]).then(_res => {
    console.log(_res);
    if (uploadIdx === MAX_UPLOAD_NUM || uploadIdx === fileList.value.length - 1) {
      relevanceFile().then(() => {
        fileList.value.splice(0, MAX_UPLOAD_NUM)
        uploadIdx = 0
        if (fileList.value.length === 0) {
          ElMessage.success('文件上传完成')
        } else {
          handleGetToken().then(() => {
            // creatOssClient()
            startUpload()
          })
        }
      })
    } else {
      uploadIdx++
      startUpload()
    }
  }).catch(() => {
    handleGetToken().then(() => {
      creatOssClient()
      startUpload()
    })
  })
}

const uploadFile = (e) => {
  return new Promise((resolve, reject) => {
    ossClient.value.put(`${storeRootPath.value}/${e.name}`, e.raw).then(res => {
      // console.log(res);
      // 存储下上传成功后的信息，后面关联resource需要用到
      uploadFileListResponse.value.push({
        name: e.name,
        meta: 'jpg',
        etag: res.res.headers.etag,
        checksum: res.res.headers.etag,
      })
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

export {
  fileList,
  handleGetToken,
  creatOssClient,
  handleChange,
  startUpload
}