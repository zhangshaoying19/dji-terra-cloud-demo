<script setup>
import { ref } from 'vue'
import ConfigVue from './modules/config.vue'
import ResourceVue from './modules/resource.vue'
import FileVue from './modules/file.vue'
import JobVue from './modules/job.vue'

const activeName = ref('config')
</script>

<template>
  <div class="view">
    <h2>这个是 前端网页端 调用 大疆智图开放api 的简单用例(在实际业务开发中仅供参考)</h2>
    <p>
      <a href="https://github.com/zhangshaoying19/dji-terra-cloud-demo/blob/main/README.md"
        target="_blank">使用说明</a>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <a href="https://developer.dji.com/doc/terra_api_tutorial/cn/quick-start.html" target="_blank">大疆智图开放文档</a>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <a href="https://developer.dji.com/doc/terra_api_tutorial/cn/api/terra/" target="_blank">大疆智图api接口</a>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <a href="https://terra-1-g.djicdn.com/851d20f7b9f64838a34cd02351370894/DJI%20Terra/%E5%85%B6%E4%BB%96%E6%96%87%E6%A1%A3/%E4%BA%A7%E5%93%81%E7%9B%B8%E5%85%B3/%E5%A4%A7%E7%96%86%E6%99%BA%E5%9B%BE%E9%87%8D%E5%BB%BA%E9%94%99%E8%AF%AF%E6%8C%87%E5%BC%95.pdf"
        target="_blank">大疆智图api错误码查询</a>
    </p>
    <el-tabs v-model="activeName" default-value="config" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="配置项(Config)" name="config">
        <ConfigVue />
      </el-tab-pane>
      <el-tab-pane label="资源管理(Resource)" name="resource">
        <ResourceVue />
      </el-tab-pane>
      <el-tab-pane label="文件管理(File)" name="file">
        <FileVue />
      </el-tab-pane>
      <el-tab-pane label="作业管理(Job)" name="job">
        <JobVue />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
