<template>
  <el-select v-model="seletFileUUID" placeholder="选择一个file" style="width: 240px;margin-right: 10px;">
    <el-option v-for="item in allResourceFlieList" :key="item.uuid" :label="item.name" :value="item.uuid" />
  </el-select>
  <el-button type="primary" @click="handleGetFileList">获取file列表</el-button>
  <el-button type="primary" @click="handleGetFileInfo">获取file信息</el-button>
  <el-button type="primary" disabled>file的增删改和resource差不多，自行查阅官方文档使用</el-button>

</template>
<script setup>
import { allResourceFlieList, seletFileUUID } from '../js/state'
import {
  handleGetFileList,
  handleGetFileInfo
} from '../js/file.js'

</script>