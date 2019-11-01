import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { Toast } from 'vant'

/**
 * http 请求工具类
 *
 * 请求拦截器 负责将客户端标识token值存储并放置在头部提交给服务端
 *
 * 相应拦截器 负责全局处理业务请求的网络或业务错误
 **/
// 创建axios实例
const service = axios.create({
  timeout: 10000 // 超时时间
});

// 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (sessionStorage.login_token) {
      config.headers.Authorization = sessionStorage.login_token; // 存储token
      // console.log("请求token",sessionStorage.login_token);
    }
    return config
  },
  (err:any) => {
    Promise.reject(err)
  }
)

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (err:any) => {
    let errMsg = '';
    if (err && err.response.status) {
      switch (err.response.status) {
      case 401:
        errMsg = '请求出错';
        break;
      case 403:
        errMsg = '还未登录，请先登录';
        // location.href = err.response.data.data.url;
          location.href = 'http://yiban.sust.edu.cn/yibanapi/?backurl=http://192.168.0.110:8081/blank';
        break;
      case 408:
        errMsg = '请求超时';
        break;
      case 500:
        errMsg = '服务器内部错误';
        break;
      case 501:
        errMsg = '服务未实现';
        break;
      case 502:
        errMsg = '网关错误';
        break;
      case 503:
        errMsg = '服务不可用';
        break;
      case 504:
        errMsg = '网关超时';
        break;
      case 505:
        errMsg = 'HTTP版本不受支持';
        break;
      default:
        errMsg = "网络连接错误";
        break
      }
    } else {
      errMsg = "网络连接错误";
    }
    Toast.fail(errMsg);
    return Promise.reject(errMsg)
  }
);

export default service
