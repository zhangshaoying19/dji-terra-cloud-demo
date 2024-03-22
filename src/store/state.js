import { ref } from 'vue'

const DJI_APP_KEY = ref('')
const DJI_SECRET_KEY = ref('')
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
  selectJobUUID
}