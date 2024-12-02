import axios from 'axios'
import Cookies from 'js-cookie'

// 创建一个 axios 实例
const api = axios.create({
  baseURL: '', // 你的API基础URL
  timeout: 1000, // 请求超时时间
  headers: { 'X-Custom-Header': 'foobar' }, // 自定义请求头
})

// 请求拦截器
api.interceptors.request.use(
  function (config) {
    const token = Cookies.get('authToken') // 使用 js-cookie 获取token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// 响应拦截器
api.interceptors.response.use(
  function (response) {
    return response.data // 只返回数据部分
  },
  function (error) {
    if (error.response) {
      switch (error.response.status) {
      case 401:
        console.error('未授权，请重新登录')
        Cookies.remove('authToken') // 使用 js-cookie 移除token
        break
      case 403:
        console.error('禁止访问')
        break
      case 404:
        console.error('请求的资源不存在')
        break
      case 500:
        console.error('服务器内部错误')
        break
      default:
        console.error('其他错误信息:', error.response.data)
      }
    } else if (error.request) {
      console.error('网络错误或服务器未响应')
    } else {
      console.error('Error', error.message)
    }
    
    return Promise.reject(error)
  },
)

export default api
