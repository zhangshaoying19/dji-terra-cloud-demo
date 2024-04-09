<template>
  <p>
    <el-button type="primary" @click="handleGetToken()">获取Token</el-button>
    <el-button type="primary" @click="creatOssClient()">创建阿里云oss实例对象</el-button>
    <el-upload style="display: inline-block;margin-left: 10px;" multiple :file-list="fileList" action=""
      :show-file-list="false" :auto-upload="false" :on-change="handleChange">
      <el-button type="primary">点击上传(文件多时需要耐心等待,建议通过控制台查看上传进度)</el-button>
    </el-upload>
  </p>
  <p>{{ tokenBody }}</p>
</template>
<script setup>
import { tokenBody } from '../js/state.js'
import {handleGetToken,creatOssClient,handleChange} from '../js/token.js'

</script>