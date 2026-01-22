import axios from 'axios'
import CryptoJS from 'crypto-js'
import { DJI_APP_KEY, DJI_SECRET_KEY } from '../api/config'
import { ElMessage } from 'element-plus'

/*
 * 生成签名
 * @param {string} content 需要签名的字符串
 * @param {string} secretKey 密钥
 * @return {string} 签名
 */
function calculateSignature(content, secretKey) {
  const hmac = CryptoJS.HmacSHA256(content, secretKey);
  const signatureBase64 = CryptoJS.enc.Base64.stringify(hmac);
  return signatureBase64;
}
/******* 
 * @description: 将对象转成URL参数字符串
 * @param {Object} params  
 * @return {*}
 */
function objectToUrlParmasString(params) {
  const paramsUrl = new URLSearchParams('')
  for (let key in params) {
    // eslint-disable-next-line no-prototype-builtins
    if (params.hasOwnProperty(key)) {
      const value = encodeURIComponent(params[key]) // 编码特殊字符
      paramsUrl.append(key, value) // 添加键值对到 URLSearchParams 对象
    }
  }
  return `?${paramsUrl}`
}


// 过滤空值
function filterNullUndefined(obj) {
  if (obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
  return obj
}


export const request = async ({
  url,
  httpMethod = 'post',
  data,
  contentType = "application/json;charset=UTF-8",
  headers = {}
}) => {
  const newData = httpMethod === 'get' ?  filterNullUndefined(data) : data

  if (DJI_APP_KEY.value == '' || DJI_SECRET_KEY.value == '') {
    ElMessage.error('请先配置APPKEY和APPSECRET')
    return Promise.reject()
  }
  const paramsStr = objectToUrlParmasString(newData)
  const URL = `/terra-rescon-be${url}${httpMethod === 'get' ? paramsStr ==='?' ? '' : paramsStr : ''}`;
  const xDate = new Date().toUTCString();
  const payloadString = JSON.stringify(newData);
  const utf8Payload = CryptoJS.enc.Utf8.parse(payloadString);
  const sha256Payload = CryptoJS.SHA256(utf8Payload);
  const digest = CryptoJS.enc.Base64.stringify(sha256Payload);
  const contentToSign = `x-date: ${xDate}\n@request-target: ${httpMethod} ${URL}\ndigest: SHA-256=${digest}`;  // 注意使用的是x-date
  const requestSignature = calculateSignature(contentToSign, CryptoJS.enc.Utf8.parse(DJI_SECRET_KEY.value));
  const authorization = `hmac username="${DJI_APP_KEY.value}", algorithm="hmac-sha256", headers="x-date @request-target digest", signature="${requestSignature}"`  // 注意使用的是x-date

  return new Promise((resolve, reject) => {
    axios(URL, {
      method: httpMethod,
      baseURL: 'api/',
      timeout: 60000,
      headers: {
        'X-Date': xDate,  // 官方使用的Date,但在浏览器中Date是请求头关键词，不能手动配置，所以使用其他名称，需注意要和前面加密时保证名称一样
        'Digest': `SHA-256=${digest}`,
        'Authorization': authorization,
        'Content-Type': contentType,
        ...headers,
      },
      data: payloadString
    }).then(res => {
      resolve(res.data.data)
    }).catch((err) => {
      reject(err)
      ElMessage.error(err.response.data.result.desc || err.message)
    })
  })
}