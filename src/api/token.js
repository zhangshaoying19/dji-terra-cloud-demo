import { request } from '../request/index.js'

// 获取Token
export function getToken() {
  return request({
    url: '/v2/store/obtain_token',
  })
}


// 返回上传回调并关联resource
export function getUploadCallBack(data) {
  return request({
    url: '/v2/store/upload_callback',
    data
  })
}