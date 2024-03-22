<script setup>
import ConfigVue from './modules/config.vue'
import TokenVue from './modules/token.vue'
import Resource from './modules/resource.vue'
import FileVue from './modules/file.vue'
import JobVue from './modules/job.vue'
</script>

<template>
  <div class="view">
      <h2>这个是 前端网页端 调用 大疆智图开放api 的简单用例，在实际业务开发中仅供参考</h2>
      <p>
        <a href="https://developer.dji.com/doc/terra_api_tutorial/cn/quick-start.html">大疆智图开放文档</a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://developer.dji.com/doc/terra_api_tutorial/cn/api/terra/">大疆智图api接口</a>
      </p>
      <el-divider>大疆智图配置项</el-divider>
      <ConfigVue />
      <el-divider>Token & 上传文件</el-divider>
      <TokenVue />
      <el-divider>Resource</el-divider>
      <Resource />
      <el-divider>File(这里的file指的是上传到oss存储并且关联到resource的file)</el-divider>
      <FileVue />
      <el-divider>Job & 下载文件</el-divider>
      <JobVue />
  </div>
</template>
