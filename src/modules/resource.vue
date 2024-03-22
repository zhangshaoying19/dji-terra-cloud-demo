<template>
  <el-select v-model="selectResourceUUID" placeholder="选择一个resource" style="width: 240px;margin-right: 10px;">
    <el-option v-for="item in resourceList" :key="item.uuid" :label="item.name" :value="item.uuid" />
  </el-select>
  <el-button type="primary" @click="handleGetResourcesList">获取所有resource</el-button>
  <el-button type="primary" @click="handleCreateResource">创建resource</el-button>
  <el-button type="primary" @click="handleDeleteResource">删除resource</el-button>
  <el-button type="primary" @click="handleGetResourcesInfo">查询信息resource</el-button>
  <el-button type="primary" @click="handleCorrelation">将上传到oss的文件关联到当前选中的resource</el-button>
</template>
<script setup>
import { selectResourceUUID, resourceList, uploadFileListResponse, callbackParam } from '../store/state.js'
import { getResourcesList, createResource, deleteResource, getRecourceInfo } from '../api/resource'
import { getUploadCallBack } from '../api/token'


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

const handleCorrelation = async () => {
  if (!selectResourceUUID.value) {
    return ElMessage.warning('请选择resource，如果没有先创建')
  }
  if (uploadFileListResponse.value.length === 0) {
    return ElMessage.warning('没有上传文件，请先上传文件')
  }

  await getUploadCallBack({
    // 这三个参数为必传项
    callbackParam: callbackParam.value,
    resourceUUID: selectResourceUUID.value,
    files: uploadFileListResponse.value
  })
  ElMessage.success('关联成功！')
}

</script>