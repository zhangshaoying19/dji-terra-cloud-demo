import { request } from '../request/index.js'

// 获取文件列表
export function getFileList(data) {
  return request({
    url: '/v2/files',
    httpMethod: 'get',
    data
  })
}

// 根据uuid删除指定文件
export function deleteFile(data) {
  return request({
    url: `/v2/files/${data.uuid}`,
    httpMethod: 'delete',
  })
}

// 根据uuid获取文件信息
export function getFileInfo(data) {
  return request({
    url: `/v2/files/${data.uuid}`,
    httpMethod: 'get',
  })
}

// 根据uuid更新文件信息
export function updateFile(data) {
  return request({
    url: `/v2/resources/${data.uuid}`,
    httpMethod: 'put',
    data: data.data,
    // headers: {   
    //   "Return-Detail": data.returnDetail // 可选
    // }
  })
}

