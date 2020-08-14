import Vue from "vue";
import QuickFetch from "quickfetch";
import CustomError from "quickfetch/src/CustomError";
// @ts-ignore
import router from "@/router/router";

const ERROR_HTTP = "ERROR_HTTP";
const isBadRequest = (status: number) => status >= 300;

/**
 * 映射 HTTP 错误时的提示语句
 */
type statusMapGetter = (
  url: string
) => {
  [key: number]: string;
};
const badStatusMap: statusMapGetter = (url) => ({
  400: "请求错误",
  401: "未授权，请登录",
  403: "拒绝访问",
  404: `请求地址出错: ${url}`,
  408: "请求超时",
  500: "服务器内部错误",
  501: "服务未实现",
  502: "网关错误",
  503: "服务不可用",
  504: "网关超时",
  505: "HTTP版本不受支持",
});

export default function useBadHTTPMiddleware(
  r: any,
  onlyCheck: boolean = false,
  fetchId: any = void 0
): Exclude<QFUseReturnType, void> {
  // bad HTTP request
  const badHTTPMiddleware = r.use(
    QuickFetch.RESPONSE,
    async (res: any, next: FetchNextMW) => {
      const { status } = res;
      if (isBadRequest(status)) {
        console.log(
          "%c[fetchWrapper] bad HTTP request: status is %s",
          "color: red",
          status
        );

        if (!onlyCheck) {
          const { fullPath } = router.currentRoute;

          switch (status) {
            case 401:
              // next(res);
              return;
            case 403:
            case 404:
            case 500:
              // console.log(res, 999);
              router.push({
                path: `/error/${status}`,
                query: {
                  from: fullPath,
                  badURL: res.url,
                },
              });
              // next(res);
              return;
            default:
              break;
          }
        }

        const err = new CustomError(ERROR_HTTP, {
          response: res,
          onlyCheck,
        });
        next(Promise.reject(err));
        return;
      }
      next(res);
    },
    fetchId
  );

  r.use(
    QuickFetch.ERROR,
    (err: any, next: FetchNextMW) => {
      if (err.message === ERROR_HTTP) {
        const { response } = err.data;
        if (!err.data.onlyCheck) {
          const { status, statusText, url } = response;
          const message = badStatusMap(url)[status] || statusText;
          if (message) {
            r._errTimeout = setTimeout(() => {
              Vue.prototype.$message.error(message);
            }, 500);
          }
        }
      }
      next(err);
    },
    fetchId
  );

  return badHTTPMiddleware;
}
