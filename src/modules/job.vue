<template>
  <el-select v-model="selectJobUUID" placeholder="选择一个resource" style="width: 240px;margin-right: 10px;">
    <el-option v-for="item in jobList" :key="item.uuid" :label="item.name" :value="item.uuid" />
  </el-select>
  <el-button type="primary" @click="handleGetJobList">获取所有job</el-button>
  <el-button type="primary" @click="handleCreateJob">创建job</el-button>
  <el-button type="primary" @click="handleGetJobInfo">获取job状态信息</el-button>
  <el-button type="primary" @click="handleStartJob">启动job</el-button>
  <el-button type="primary" @click="handleDeleteJob">删除job</el-button>
  <el-button type="primary" @click="handleGetOutRescourceInfo">获取输出资源信息</el-button>
  <el-button type="primary" @click="handleDownLoadFile">下载文件（zip, 下载文件需要时间等待，推荐在控制台查看进度）</el-button>
  <el-button type="primary" disabled>job的其他操作如删、改、查，请查询官方文档</el-button>
</template>
<script setup>
import { jobList, selectJobUUID } from '../js/state'
import { handleGetJobList, handleCreateJob, handleGetJobInfo, handleStartJob, handleGetOutRescourceInfo, handleDownLoadFile,handleDeleteJob } from '../js/job.js'
</script>