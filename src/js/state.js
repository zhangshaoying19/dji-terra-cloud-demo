import { ref } from 'vue'

const DJI_APP_KEY = ref('Cs9VltYlQevdy5gJV78PH')
const DJI_SECRET_KEY = ref('9L7wIfDNaRR2VTt3RPpB3G0KL6VvnT1s')
const tokenBody = ref()
const storeRootPath = ref('')
const callbackParam = ref('')
const ossClient = ref(null)
const uploadFileListResponse = ref([])
const resourceList = ref([])
const selectResourceUUID = ref('')
const allResourceFlieList = ref([])
const seletFileUUID = ref('')
const jobList = ref([])
const selectJobUUID = ref('')
const outputResourceUuid = ref('')  // 这里是job在运行完后通过查询job信息获取的，主要用来查询输出的resoure的uuid，以便下载智图生成后的文件，具体参考（https://developer.dji.com/doc/terra_api_tutorial/cn/quick-start.html）
const outFileUUIds = ref([])  // 这个是job执行完后，通过名称前缀为output of job的resource所获取的所有文件uuid，我们要通过这些uuid查询文件信息，拿到oss的地址然后下载
const fileList = ref([])  /* 要上传的文件列表 */

export {
  DJI_APP_KEY,
  DJI_SECRET_KEY,
  storeRootPath,
  tokenBody,
  ossClient,
  callbackParam,
  uploadFileListResponse,
  resourceList,
  selectResourceUUID,
  allResourceFlieList,
  seletFileUUID,
  jobList,
  selectJobUUID,
  outFileUUIds,
  outputResourceUuid,
  fileList
}