import Vue from 'vue';
import QuickFetch from 'quickfetch';
import CustomError from '../CustomError';
import { isValidCode, getErrorTip } from './busi.utils';

export const ERROR_BUSINESS = 'ERROR_BUSINESS';

/**
 * 根据 getGlobalConfig 接口获得的返回值对业务逻辑错误做出通用的提示
 * @param {string} reqStr - 错误发生时的接口请求 URL，格式为 `${method} ${url}`
 * @param {Object} json - 返回的 {code, message, data} 对象
 * @param {Headers} headers
 * @param {Boolean} [isValid=false]
 */
const warnByResponse = (reqStr, json, headers, isValid = false) => {
  const _msg = getErrorTip(reqStr, json, headers);
  if (_msg) {
    alert(_msg);
    // Vue.prototype.$message({
    //   message: _msg,
    //   type: isValid
    //     ? 'success'
    //     : 'error',
    //   duration: isValid
    //     ? 3000
    //     : 7000
    // });
  }
};

export default function useWrongBusiMiddleware(r) {
  // wrong business logic
  const wrongBusiMiddleware = r.use(QuickFetch.RESPONSE, async (res, next) => {
    if (res instanceof Response) {
      const { requestHeaders, url } = res;
      const { method } = res;
      
      const json = await res.clone().json(); // clone() is important!
      const { code } = json;
      if (!isValidCode(code)) {
        console.log('%c[fetchWrapper] wrong business logic: code is %s', 'color: red', code);
        const err = new CustomError(ERROR_BUSINESS, {
          response: res
        });
        next(Promise.reject(err));
        return;
      }
      warnByResponse(`${method} ${url}`, json, requestHeaders, true);
      next(res);
      return;
    }
    next(res);
  });

  r.use(QuickFetch.ERROR, async (err, next) => {
    if (err.message === ERROR_BUSINESS) {
      clearTimeout(r._errTimeout);
      const { response } = err.data;
      const { url } = response;
      const { method, headers } = err.request; 
      const json = await response.json();
      const { code, data } = json;
      warnByResponse(`${method} ${url}`, json, headers, false);
    }
    next(err);
  });

  return wrongBusiMiddleware;
}
