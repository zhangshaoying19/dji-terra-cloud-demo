import { request } from '../request/index.js'

// 获取用户拥有的文件列表
export function getFileList(data) {
  return request({
    url: '/v2/files',
    httpMethod: 'get',
    data
  })
}

// 根据uuid删除文件
export function deleteFile(data) {
  return request({
    url: `/v2/files/${data.uuid}`,
    httpMethod: 'delete',
  })
}

// 根据 uuid 获取文件详情
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

