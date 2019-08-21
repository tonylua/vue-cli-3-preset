import Vue from 'vue';
import QuickFetch from 'quickfetch';
// import router from '@/router/router';
import CustomError from '../CustomError';

const ERROR_HTTP = 'ERROR_HTTP';
const isBadRequest = status => status >= 300;

/**
 * 映射 HTTP 错误时的提示语句
 * @returns {Object}
 */
const badStatusMap = (url) => ({
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: `请求地址出错: ${url}`,
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
});

export default function useBadHTTPMiddleware(r) {
  // bad HTTP request
  const badHTTPMiddleware = r.use(QuickFetch.RESPONSE, async (res, next) => {
    const { status } = res;
    if (isBadRequest(status)) {
      console.log('%c[fetchWrapper] bad HTTP request: status is %s', 'color: red', status);

      switch (status) {
        // case 401:
        //   router.push({
        //     path: '/login',
        //     query: {
        //       redirect: router.currentRoute.path,
        //       relogin: 'yes'
        //     }
        //   });
        //   // next(res);
        //   return;
        // case 403:
        // case 404:
        // case 500:
        //   router.push({
        //     path: `/error/${status}`
        //   });
        //   // next(res);
        //   return;
        default:
          break;
      }

      const err = new CustomError(ERROR_HTTP, {
        response: res
      });
      next(Promise.reject(err));
      return;
    }
    next(res);
  });

  r.use(QuickFetch.ERROR, (err, next) => {
    if (err.message === ERROR_HTTP) {
      const { status, statusText, url } = err.data.response;
      const message = badStatusMap(url)[status] || statusText;
      if (message) {
        r._errTimeout = setTimeout(() => {
          // Vue.prototype.$message.error(message);
          alert(message);
        }, 500);
      }
    }
    next(err);
  });

  return badHTTPMiddleware;
}
