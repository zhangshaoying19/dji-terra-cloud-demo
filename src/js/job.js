import JSZip from 'jszip'
import FileSaver from 'file-saver'
import axios from 'axios';
import { outputResourceUuid, outFileUUIds, selectJobUUID, jobList } from './state.js'
import { cteateJob, getJobList, jobStart, getJobInfo } from '../api/job'
import { getFileInfo } from '../api/file'
import { getRecourceInfo } from '../api/resource'
import { ElMessage } from 'element-plus'

const handleGetJobList = async () => {
  const res = await getJobList({  // 配置自行决定
    rows: 100,
    page: 1,
  })
  // console.log(res);
  ElMessage.success('获取job列表成功')
  jobList.value = res.list
}

const handleCreateJob = async () => {
  await cteateJob({
    name: `新建job${new Date()}`  // 名称自行决定
  })
  ElMessage.success('创建job成功')
  // console.log(res);
  handleGetJobList()
}

const handleGetJobInfo = async () => {
  if (!selectJobUUID.value) {
    return ElMessage.warning('请选择一个job')
  }
  const res = await getJobInfo({
    uuid: selectJobUUID.value
  })
  // console.log(res);
  ElMessage.success('获取job状态信息成功,请去控制台查看')
  console.log('查询的job信息', res);
  outputResourceUuid.value = res.outputResourceUuid
}

const handleStartJob = async () => {
  if (!selectJobUUID.value) {
    return ElMessage.warning('请选择一个job')
  }
  if (!selectResourceUUID.value) {
    return ElMessage.warning('请选择一个resource')
  }
  const res = await jobStart({   //  返回一个Job 实例对象 包含所有job信息
    uuid: selectJobUUID.value,
    data: {
      resourceUuid: selectResourceUUID.value,
      type: 15,   // 2D：14   3D: 15   LiDAR：13
      parameters: "{\"parameter\": {\"output_mesh\": true,\"generate_obj\": true,\"generate_b3dm\": true,\"generate_osgb\": true,\"output_geo_desc\": {\"cs_type\": \"GEO_CS\",\"geo_cs\": \"EPSG:4326\",\"override_vertical_cs\": \"EPSG:5773\"}}}"   // 必须为字符串
    }
  })
  // console.log(res);
  ElMessage.success('启动job成功')
}

const handleGetOutRescourceInfo = async () => {
  if (!outputResourceUuid.value) {
    return ElMessage.warning('请选择一个job查询信息')
  }
  const res = await getRecourceInfo({
    uuid: outputResourceUuid.value
  })
  // console.log(res);
  // outFileUUIds = res.fileUuids.slice(0,9)
  outFileUUIds.value = res.fileUuids
}

const getFile = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url,
      responseType: "blob"
    }).then(data => {
      resolve(data.data);
    }).catch(error => {
      reject(error.toString());
    });
  });
}


const downLoad = (data) => {
  const zip = new JSZip();
  const cache = {};
  const promises = [];
  data.forEach(item => {
    const promise = getFile(item.url).then(data => {
      // // 下载文件, 并存成ArrayBuffer对象
      zip.file(item.name, data, { binary: true }); // 逐个添加文件
      cache[item.name] = data;
    });
    promises.push(promise);
  });
  Promise.all(promises).then(() => {
    zip.generateAsync({
      type: "blob", compression: 'DEFLATE',  // STORE: 默认不压缩， DEFLATE：需要压缩
      compressionOptions: {
        level: 9          // 压缩等级 1~9   1 压缩速度最快， 9 最优压缩方式
      }
    }).then(content => {
      // 生成二进制流
      FileSaver.saveAs(content, "智图生成结果.zip"); // 利用file-saver保存文件  自定义文件名
    });
  });
}

const handleDownLoadFile = () => {
  if (outFileUUIds.value.length === 0) {
    return ElMessage.warning('请先点击《获取输出资源信息》的按钮')
  }
  const outFileInfosPromise = outFileUUIds.value.map(async (item) => {
    const info = await getFileInfo({
      uuid: item
    })
    return info
  })
  Promise.all(outFileInfosPromise).then(res => {
    console.log(res);
    downLoad(res)
  })
}

export {
  handleDownLoadFile,
  downLoad,
  getFile,
  handleGetOutRescourceInfo,
  handleStartJob,
  handleGetJobInfo,
  handleCreateJob,
  handleGetJobList,
}