import { ElMessage } from 'element-plus'
import { getResourcesList, createResource, deleteResource, getRecourceInfo } from '../api/resource'
import { getUploadCallBack } from '../api/token'
import { uploadFileListResponse, callbackParam, selectResourceUUID, resourceList } from './state.js'

const handleGetResourcesList = async () => {
  const res = await getResourcesList({  // 这里的参数自行结合使用
    rows: 100,
    page: 1,
    // search: '',
    // uuids: '',
    // type: 'map'  // map | job_output
  })
  // console.log(res);
  ElMessage.success('获取reource列表成功')
  resourceList.value = res.list
}

const handleDeleteResource = async () => {
  await deleteResource({
    uuid: selectResourceUUID.value,
    deleteMode: 1  // 这里自行查看api文档，来选择删除模式
  })
  // console.log(res);
  ElMessage.success('删除reource成功')
  selectResourceUUID.value = ''
  handleGetResourcesList()
}

const handleCreateResource = async () => {
  await createResource({
    name: `新建resource-${new Date()}`,  // 这个根据自己的需求设置规则
    type: "map"  // job_output(不要手动设置这个类型，会和job生成的混淆) 
  })
  // console.log(res);
  ElMessage.success('创建reource成功')
  handleGetResourcesList()
}

const handleGetResourcesInfo = async () => {
  const res = await getRecourceInfo({
    uuid: selectResourceUUID.value,
  })
  ElMessage.success('查询reource信息成功,请去控制台查看')
  console.log('查询的reource信息', res);
}

const relevanceFile = () => {
  return new Promise((resolve, reject) => {
    getUploadCallBack({
      // 这三个参数为必传项
      callbackParam: callbackParam.value,
      resourceUUID: selectResourceUUID.value,
      files: uploadFileListResponse.value
    }).then(res => {
      uploadFileListResponse.value = []
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export {
  handleGetResourcesList,
  handleDeleteResource,
  handleCreateResource,
  handleGetResourcesInfo,
  relevanceFile
}