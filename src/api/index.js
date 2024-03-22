import { request } from '../request/index.js'

// 获取Token
export function getToken() {
  return request({
    url: '/v2/store/obtain_token',
  })
}

// 创建resource
export function createResource(data) {
  return request({
    url: '/v2/resources',
    data
  })
}

// 返回上传回调并关联resource
export function getUploadCallBack(data) {
  return request({
    url: '/v2/store/upload_callback',
    data
  })
}

// 获取资源列表
export function getResourcesList(data) {
  return request({
    url: '/v2/resources',
    httpMethod: 'get',
    data
  })
}
// 删除指定资源
export function deleteResource(data) {
  return request({
    url: `/v2/resources/${data.uuid}?deleteMode=${data.deleteMode}`,
    httpMethod: 'delete',
  })
}

// 获取执行资源的信息
export function getRecourceInfo(data) {
  return request({
    url: `/v2/resources/${data.uuid}`,
    httpMethod: 'get',
  })
}

// 获取文件列表
export function getFileList(data) {
  return request({
    url: '/v2/files',
    httpMethod: 'get',
    data
  })
}

// 创建job
export function cteateJob(data) {
  return request({
    url: '/v2/jobs',
    data
  })
}

// 获取job列表
export function getJobList(data) {
  return request({
    url: '/v2/jobs',
    httpMethod: 'get',
    data
  })
}

// 启动job
export function jobStart(data) {
  return request({
    url: `/v2/jobs/${data.uuid}/start`,
    httpMethod: 'post',
    data: data.data
  })
}

// 获取job信息
export function getJobInfo(data) {
  return request({
    url: `/v2/jobs/${data.uuid}`,
    httpMethod: 'get',
  })
}

// 根据uuid获取文件信息
export function getFileInfo(data) {
  return request({
    url: `/v2/files/${data.uuid}`,
    httpMethod: 'get',
  })
}