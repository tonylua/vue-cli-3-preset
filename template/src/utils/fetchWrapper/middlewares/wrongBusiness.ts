import Vue from "vue";
import QuickFetch from "quickfetch";
import CustomError from "quickfetch/src/CustomError";
import { isValidCode, getErrorTip, KEY_CODE } from "./busi.utils";

export const ERROR_BUSINESS = "ERROR_BUSINESS";

/**
 * 根据 getGlobalConfig 接口获得的返回值对业务逻辑错误做出通用的提示
 */
const warnByResponse = (
  reqStr: string,
  json: FetchResJSON,
  headers: Headers,
  isValid = false
): void => {
  const _msg = getErrorTip(reqStr, json, headers);
  if (_msg) {
    Vue.prototype.$message({
      message: _msg,
      type: isValid ? "success" : "error",
      duration: isValid ? 3000 : 7000,
    });
  }
};

export default function useWrongBusiMiddleware(
  r: any
): Exclude<QFUseReturnType, void> {
  // wrong business logic
  const wrongBusiMiddleware = r.use(
    QuickFetch.RESPONSE,
    async (res: any, next: FetchNextMW) => {
      if (res instanceof Response) {
        // @ts-ignore
        const { requestHeaders, url } = res;
        // @ts-ignore
        const { method } = res;

        const json = await res.clone().json(); // clone() is important!
        if (!isValidCode(json[KEY_CODE])) {
          console.log(
            "%c[fetchWrapper] wrong business logic: code is %s",
            "color: red",
            json[KEY_CODE],
            url
          );
          const err = new CustomError(ERROR_BUSINESS, {
            response: res,
          });
          next(Promise.reject(err));
          return;
        }
        warnByResponse(`${method} ${url}`, json, requestHeaders, true);
        next(res);
        return;
      }
      next(res);
    }
  );

  r.use(QuickFetch.ERROR, async (err: any, next: FetchNextMW) => {
    if (err.message === ERROR_BUSINESS) {
      clearTimeout(r._errTimeout);
      const { response } = err.data;
      const { url } = response;
      const { method, headers } = err.request;
      const json = await response.json();
      // const { code, data } = json;
      // if (json[KEY_CODE] === ORDER_ERROR) {
      //   let jumpURL = `${ORDER_URL}/createFail?errorType=`;
      //   if (data && data.errType) jumpURL += data.errType;
      //   window.location.href = jumpURL;
      // } else {
      warnByResponse(`${method} ${url}`, json, headers, false);
      // }
    }
    next(err);
  });

  return wrongBusiMiddleware;
}
