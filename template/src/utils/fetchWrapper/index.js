import { mergeWith, findIndex } from "lodash";
import saveAs from "file-saver";
// @ts-ignore
import QuickFetch from "quickfetch";
import useHeadersMiddleware from "./middlewares/headers";
import useTimeoutMiddleware from "./middlewares/timeout";
import useBadHTTPMiddleware from "./middlewares/badHTTP";
import useWrongBusiMiddleware from "./middlewares/wrongBusiness.ts";
import { API_PREFIX } from "./constants";

/**
 * 用于配置请求基本信息的常量
 */
const TIMEOUT = 30000;

/**
 * 用于在路由切换时中断不必要的请求
 * @see src/router/util::abortPeddingFetches()
 */
window.abortFetchIds = [];

const Wrapper = function (option) {
  const r = new QuickFetch(
    mergeWith(
      {
        endpoint: window.API_ENDPOINT, // see main.js
        timeout: TIMEOUT,
        baseURL: API_PREFIX,
        ignoreBodyMethods: ["get", "head", "delete"],
      },
      option
    )
  );

  r.addEventListener(QuickFetch.EVENT_FETCH_ABORT, (e) => {
    console.log("fetch abort", e.detail.fetchId);
  });

  useHeadersMiddleware(r);
  useTimeoutMiddleware(r);
  const badHttpMiddleware = useBadHTTPMiddleware(r);
  const wrongBusiMiddleware = useWrongBusiMiddleware(r);

  // extend a download method
  r.download = function (method, url, params, roption) {
    const dlFetchId = "my_download";

    wrongBusiMiddleware.pause(dlFetchId);

    const downHeadersMiddleware = r.use(
      QuickFetch.REQUEST,
      (req, next) => {
        req.headers.set("Content-Type", "application/x-www-form-urlencoded");
        next(req);
      },
      dlFetchId
    );

    return QuickFetch.prototype[method.toLowerCase()]
      .call(
        r,
        url,
        params,
        mergeWith(roption, {
          fetchId: dlFetchId,
          catchError: false,
        })
      )
      .then((res) => {
        const isJSON = /^application\/(.*?\+)?json;?/.test(
          res.headers.get("Content-Type")
        );
        if (isJSON) return res.json();

        let filename = roption.filename;
        if (!filename) {
          const disposition = res.headers.get("content-disposition");
          if (disposition && disposition.match(/attachment/)) {
            filename = disposition
              .replace(/attachment;.*filename=/, "")
              .replace(/"/g, "");
          } else {
            filename = "noname";
          }
        }
        res.blob().then((blob) => saveAs(blob, filename));
      })
      .finally(() => {
        downHeadersMiddleware.unuse();
        wrongBusiMiddleware.resume(dlFetchId);
      });
  };

  ["get", "post", "delete", "put", "patch"].forEach((method) => {
    const originFunc = r[method];
    r[method] = function (...args) {
      // eslint-disable-next-line prefer-const
      let [a, b, roption] = args;

      const fetchId = `r${Date.now()}`;
      // eslint-disable-next-line no-multi-assign
      if (!b) args[1] = b = null;
      // eslint-disable-next-line no-multi-assign
      if (!roption) args[2] = roption = {};
      args[2].fetchId = fetchId;

      if (!roption.ignoreAbortBeforeRoute) {
        window.abortFetchIds.push(fetchId);
      }

      if (roption.ignoreBusiCheck) {
        // 忽略特殊请求的业务逻辑码检查
        wrongBusiMiddleware.pause(fetchId);
        console.log("ignore business code check", a);
      }
      if (roption.ignoreHTTPCheck) {
        // 忽略消息轮询等请求的http检查
        badHttpMiddleware.pause(fetchId);
        useBadHTTPMiddleware(r, true, fetchId);
        console.log("ignore http check", a);
      }

      r._args = args;

      return originFunc.apply(r, args).then(async (res) => {
        if (res instanceof Error) {
          return Promise.reject(res);
        }

        const fidx = findIndex(
          window.abortFetchIds,
          (id) => id === args[2].fetchId
        );
        if (fidx > -1) window.abortFetchIds.splice(fidx, 1);

        const resJson = await res.json();
        return resJson;
      });
    };
  }); // end of http methods

  return r;
};

export default Wrapper;
