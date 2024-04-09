import { getFileList, getFileInfo } from '../api/file'
import { ElMessage } from 'element-plus'

const handleGetFileList = async () => {
  const res = await getFileList({  // 参数自行配置
    rows: 1000,
    page: 1,
  })
  // console.log(res);
  ElMessage.success('获取File列表成功')
  allResourceFlieList.value = res.list
}

const handleGetFileInfo = async () => {
  if (!seletFileUUID.value) {
    return ElMessage.warning('先选择一个file')
  }
  const res = await getFileInfo({
    uuid: seletFileUUID.value, // 选择一个file
  })
  ElMessage.success('查询file信息成功,请去控制台查看')
  console.log('查询的file信息', res);
}

export {
  handleGetFileList,
  handleGetFileInfo
}