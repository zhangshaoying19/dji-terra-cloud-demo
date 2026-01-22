import { request } from '../request/index.js'

// 获取STS Token用于上传文件，Token有效期为10分钟。
export function getToken() {
  return request({
    url: '/v2/store/obtain_token',
  })
}


// 使用 STS Token 上传文件完成后，调用此接口进行回调。param 为获取 STS Token 时返回的 callbackParam
export function getUploadCallBack(data) {
  return request({
    url: '/v2/store/upload_callback',
    data
  })
}