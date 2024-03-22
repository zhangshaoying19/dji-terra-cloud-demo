import { request } from '../request/index.js'


// 创建resource
export function createResource(data) {
  return request({
    url: '/v2/resources',
    data,
    // headers: {   
    //   "Return-Detail": data.returnDetail // 可选
    // }
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

// 根据uuid获取资源的信息
export function getRecourceInfo(data) {
  return request({
    url: `/v2/resources/${data.uuid}`,
    httpMethod: 'get',
  })
}

// 根据uuid更新资源的信息
export function updateRecource(data) {
  return request({
    url: `/v2/resources/${data.uuid}`,
    httpMethod: 'put',
    // headers: {   
    //   "Return-Detail": data.returnDetail // 可选
    // }
  })
}

// 新增一个资源，并将指定 uuid 的资源文件复制到该资源下
export function copyResource(data) {
  return request({
    url: `/v2/resources/${data.uuid}/copy`,
    httpMethod: 'post',
    data: data.data
  })
}

// 对指定 uuid 的资源文件进行增删操作
export function updateRecourceFile(data) {
  return request({
    url: `/v2/resources/${data.uuid}/file_operation`,
    httpMethod: 'post',
    data: data.data
  })
}