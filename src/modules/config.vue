<template>
  <p> <a href="https://developer.dji.com/cn/terra-api-console/detail/">申请大疆智图的开发密钥(审核时间一般为10个工作日内)</a></p>
  <p>DJI_APP_KEY</p>
    <el-input class="el-input-custom" placeholder="请输入在大疆智图申请的DJI_APP_KEY" v-model="DJI_APP_KEY" />
    <p>DJI_SECRET_KEY</p>
    <el-input class="el-input-custom" type="password" placeholder="请输入在大疆智图申请的DJI_SECRET_KEY" v-model="DJI_SECRET_KEY" />
</template>
<script setup>
import {DJI_APP_KEY,DJI_SECRET_KEY} from '../api/config.js'
</script>