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
import { selectResourceUUID, resourceList } from '../js/state.js'
import {handleGetResourcesList,handleCreateResource,handleDeleteResource,handleGetResourcesInfo,handleCorrelation} from '../js/resource.js'

</script>