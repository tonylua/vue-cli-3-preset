import { mergeWith } from 'lodash';
import saveAs from 'file-saver';
import QuickFetch from 'quickfetch';
import useHeadersMiddleware from './middlewares/headers';
import useTimeoutMiddleware from './middlewares/timeout';
import useBadHTTPMiddleware from './middlewares/badHTTP';
import useWrongBusiMiddleware from './middlewares/wrongBusiness';

/**
 * 用于配置请求基本信息的常量
 */
const TIMEOUT = 30000;

const Wrapper = function(option) {
  const r = new QuickFetch(mergeWith({
    timeout: TIMEOUT,
    baseURL: '/ajax-api',
    ignoreBodyMethods: ['get', 'head', 'delete']
  }, option));

  useHeadersMiddleware(r);
  useTimeoutMiddleware(r);
  const badHttpMiddleware = useBadHTTPMiddleware(r);
  const wrongBusiMiddleware = useWrongBusiMiddleware(r);

  // extend a download method
  r.download = function(method, url, params, roption) {
    const dlFetchId = 'my_download';

    wrongBusiMiddleware.pause(dlFetchId);

    const downHeadersMiddleware = r.use(QuickFetch.REQUEST, (req, next) => {
      req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      next(req);
    }, dlFetchId);

    return QuickFetch.prototype[method.toLowerCase()]
      .call(r, url, params, mergeWith(roption, {
        fetchId: dlFetchId,
        catchError: false
      }))
      .then(
        (res) => {
          const disposition = res.headers.get('content-disposition');
          if (disposition && disposition.match(/attachment/)) {
            let filename = disposition.replace(/attachment;.*filename=/, '').replace(/"/g, '');
            filename = filename && filename !== ''
              ? filename
              : 'download';
            res.blob().then(blob => saveAs(blob, filename));
          }
          return res.json();
        }
      )
      .finally(
        () => {
          downHeadersMiddleware.unuse();
          wrongBusiMiddleware.resume(dlFetchId);
        }
      );
  };

  ['get', 'post', 'delete', 'put', 'patch'].forEach((method) => {
    const originFunc = r[method];
    r[method] = function(...args) {
      const fetchId = `r${Date.now()}`;
      if (args.length > 2) args[2].fetchId = fetchId;
      const [a, b, roption] = args;
      if (roption && roption.ignoreBusiCheck) {
        // 在特殊请求的第3个参数中设置ignoreBusiCheck，忽略业务逻辑码检查
        wrongBusiMiddleware.pause(fetchId);
        console.log('ignore business code check', a);
      }
      if (roption && roption.ignoreHTTPCheck) {
        // 在特殊请求的第3个参数中设置ignoreHTTPCheck，忽略http检查
        badHttpMiddleware.pause(fetchId);
        console.log('ignore http check', a);
      }
      
      r._args = args;

      return originFunc.apply(r, args)
        .then(async (res) => {
          if (res instanceof Error) {
            return Promise.reject(res);
          }
          const resJson = await res.json();
          return resJson;
        });
    };
  }); // end of http methods

  return r;
};

export default Wrapper;
