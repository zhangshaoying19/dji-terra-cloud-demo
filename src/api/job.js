import { request } from '../request/index.js'


// 获取作业列表
export function getJobList(data) {
  return request({
    url: '/v2/jobs',
    httpMethod: 'get',
    data
  })
}


// 创建一个作业，作业开始后，会将 resourceUuid 对应的资源置为不可修改状态
export function createJob(data) {
  return request({
    url: '/v2/jobs',
    data
  })
}

// 启动指定 uuid 的作业
export function jobStart(data) {
  return request({
    url: `/v2/jobs/${data.uuid}/start`,
    httpMethod: 'post',
    data: data.data
  })
}

// 获取指定 uuid 的作业详情
export function getJobInfo(data) {
  return request({
    url: `/v2/jobs/${data.uuid}`,
    httpMethod: 'get',
  })
}

// 删除指定 uuid 的 job
export function deleteJob(data) {
  return request({
    url: `/v2/jobs/${data.uuid}`,
    httpMethod: 'delete',
  })
}

// 更新指定 uuid 的作业详情
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

// 复制指定 uuid 的作业
export function copyJob(data) {
  return request({
    url: `/v2/jobs/${data.uuid}/copy`,
    httpMethod: 'post',
    data: data.data
  })
}

// 停止指定 uuid 的作业, 需要 job 的 status < 4
export function jobStop(data) {
  return request({
    url: `/v2/jobs/${data.uuid}/stop`,
    httpMethod: 'post',
  })
}