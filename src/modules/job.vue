<template>
  <el-select v-model="selectJobUUID" placeholder="选择一个resource" style="width: 240px;margin-right: 10px;">
    <el-option v-for="item in jobList" :key="item.uuid" :label="item.name" :value="item.uuid" />
  </el-select>
  <el-button type="primary" @click="handleGetJobList">获取所有job</el-button>
  <el-button type="primary" @click="handleCreateJob">创建job</el-button>
  <el-button type="primary" @click="handleGetJobInfo">获取job状态信息</el-button>
  <el-button type="primary" @click="handleStartJob">启动job</el-button>
  <el-button type="primary" @click="handleGetOutRescourceInfo">获取输出资源信息</el-button>
  <el-button type="primary" @click="handleDownLoadFile">下载文件（zip, 下载文件需要时间等待，推荐在控制台查看进度）</el-button>
  <el-button type="primary" disabled>job的其他操作如删、改、查，请查询官方文档</el-button>
</template>
<script setup>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import axios from 'axios';
import { ref } from 'vue'
import { jobList, selectJobUUID, selectResourceUUID } from '../store/state'
import { cteateJob, getJobList, jobStart, getJobInfo } from '../api/job'
import { getFileInfo } from '../api/file'
import { getRecourceInfo } from '../api/resource'

const outputResourceUuid = ref('')  // 这里是job在运行完后通过查询job信息获取的，主要用来查询输出的resoure的uuid，以便下载智图生成后的文件，具体参考（https://developer.dji.com/doc/terra_api_tutorial/cn/quick-start.html）

const outFileUUIds = ref([])  // 这个是job执行完后，通过名称前缀为output of job的resource所获取的所有文件uuid，我们要通过这些uuid查询文件信息，拿到oss的地址然后下载

const handleGetJobList = async () => {
  const res = await getJobList({  // 配置自行决定
    rows: 100,
    page: 1,
  })
  // console.log(res);
  ElMessage.success('获取job列表成功')
  jobList.value = res.list
}

const handleCreateJob = async () => {
  await cteateJob({
    name: `新建job${new Date()}`  // 名称自行决定
  })
  ElMessage.success('创建job成功')
  // console.log(res);
  handleGetJobList()
}

const handleGetJobInfo = async () => {
  if (!selectJobUUID.value) {
    return ElMessage.warning('请选择一个job')
  }
  const res = await getJobInfo({
    uuid: selectJobUUID.value
  })
  // console.log(res);
  ElMessage.success('获取job状态信息成功,请去控制台查看')
  console.log('查询的job信息', res);
  outputResourceUuid.value = res.outputResourceUuid
}

const handleStartJob = async () => {
  if (!selectJobUUID.value) {
    return ElMessage.warning('请选择一个job')
  }
  if (!selectResourceUUID.value) {
    return ElMessage.warning('请选择一个resource')
  }
  const res = await jobStart({   //  返回一个Job 实例对象 包含所有job信息
    uuid: selectJobUUID.value,
    data: {
      resourceUuid: selectResourceUUID.value,
      type: 14,   // 2D：14   3D: 15   LiDAR：13
      parameters: "{\"parameter\":{\"map_mode\":1,\"quality_level\":1,\"output_geo_desc\":{\"cs_type\":\"GEO_CS\",\"geo_cs\":\"EPSG:32650\",\"geo_cs_wkt\":\"\",\"override_vertical_cs\":\"\"}}}"   // 必须为字符串
    }
  })
  // console.log(res);
  ElMessage.success('启动job成功')
}

const handleGetOutRescourceInfo = async () => {
  if (!outputResourceUuid.value) {
    return ElMessage.warning('请选择一个job查询信息')
  }
  const res = await getRecourceInfo({
    uuid: outputResourceUuid.value
  })
  // console.log(res);
  // outFileUUIds = res.fileUuids.slice(0,9)
  outFileUUIds.value = res.fileUuids
}

const getFile = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url,
      responseType: "blob"
    }).then(data => {
      resolve(data.data);
    }).catch(error => {
      reject(error.toString());
    });
  });
}


const downLoad = (data) => {
  const zip = new JSZip();
  const cache = {};
  const promises = [];
  data.forEach(item => {
    const promise = getFile(item.url).then(data => {
      // // 下载文件, 并存成ArrayBuffer对象
      zip.file(item.name, data, { binary: true }); // 逐个添加文件
      cache[item.name] = data;
    });
    promises.push(promise);
  });
  Promise.all(promises).then(() => {
    zip.generateAsync({
      type: "blob", compression: 'DEFLATE',  // STORE: 默认不压缩， DEFLATE：需要压缩
      compressionOptions: {
        level: 9          // 压缩等级 1~9   1 压缩速度最快， 9 最优压缩方式
      }
    }).then(content => {
      // 生成二进制流
      FileSaver.saveAs(content, "智图生成结果.zip"); // 利用file-saver保存文件  自定义文件名
    });
  });
}

const handleDownLoadFile = () => {
  if (outFileUUIds.value.length === 0) {
    return ElMessage.warning('请先点击《获取输出资源信息》的按钮')
  }
  const outFileInfosPromise = outFileUUIds.value.map(async (item) => {
    const info = await getFileInfo({
      uuid: item
    })
    return info
  })
  Promise.all(outFileInfosPromise).then(res => {
    console.log(res);
    downLoad(res)
  })
}


</script>