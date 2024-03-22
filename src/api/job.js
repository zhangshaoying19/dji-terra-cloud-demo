import { request } from '../request/index.js'

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

// 根据uuid获取job信息
export function getJobInfo(data) {
  return request({
    url: `/v2/jobs/${data.uuid}`,
    httpMethod: 'get',
  })
}

// 根据uuid删除job
export function deleteJob(data) {
  return request({
    url: `/v2/jobs/${data.uuid}`,
    httpMethod: 'delete',
  })
}

// 更新指定uuid的job信息
export function updateJob(data) {
  return request({
    url: `/v2/jobs/${data.uuid}`,
    httpMethod: 'put',
    data: data.data,
    // headers: {   
    //   "Return-Detail": data.returnDetail // 可选
    // }
  })
}

// 复制job
export function copyJob(data) {
  return request({
    url: `/v2/jobs/${data.uuid}/copy`,
    httpMethod: 'post',
    data: data.data
  })
}

// job 停止  需要 job 的 status < 4
export function jobStop(data) {
  return request({
    url: `/v2/jobs/${data.uuid}/stop`,
    httpMethod: 'post',
    data: data.data
  })
}