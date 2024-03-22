<template>
  <el-select v-model="seletFileUUID" placeholder="选择一个file" style="width: 240px;margin-right: 10px;">
    <el-option v-for="item in allResourceFlieList" :key="item.uuid" :label="item.name" :value="item.uuid" />
  </el-select>
  <el-button type="primary" @click="handleGetFileList">获取file列表</el-button>
  <el-button type="primary" @click="handleGetFileInfo">获取file信息</el-button>
  <el-button type="primary" disabled>file的增删改和resource差不多，自行查阅官方文档使用</el-button>

</template>
<script setup>
import { allResourceFlieList, seletFileUUID } from '../store/state'
import { getFileList, getFileInfo } from '../api/file'

const handleGetFileList = async () => {
  const res = await getFileList({  // 参数自行配置
    rows: 10,
    page: 1,
  })
  // console.log(res);
  ElMessage.success('获取File列表成功')
  allResourceFlieList.value = res.list
}

const handleGetFileInfo = async () => {
  if (!seletFileUUID.value) {
    return ElMessage.warning('先选择一个file')
  }
  const res = await getFileInfo({
    uuid: seletFileUUID.value, // 选择一个file
  })
  ElMessage.success('查询file信息成功,请去控制台查看')
  console.log('查询的file信息', res);
}
</script>