import { mergeWith } from 'lodash';
import saveAs from 'file-saver'
import Requester from './requester';

const isBadRequest = status => status >= 300;

const isValidCode = (code) => {
  const c = parseInt(code, 10);
  return (!Number.isNaN(c)) && (c === 0);
};

const wrapper = function(option) {
  const r = new Requester(option);

  // timeout
  r.use(Requester.ERROR, (err, next) => {
    if (Requester.EXCEPTION_TIMEOUT === err.message) {
      console.warn('[FetchWrapper] catch a error: ', err.message, err.request);
    }
    next(err);
  });
  
  // bad HTTP request
  r.use(Requester.RESPONSE, (res, next) => {
    const { status } = res;
    if (isBadRequest(status)) {
      console.warn('[FetchWrapper] bad HTTP request: status is ', status);
      next(new Error(status));
      return;
    }
    next(res);
  });

  // wrong business logic
  const operation1 = r.use(Requester.RESPONSE, (res, next) => {
    if (res instanceof Response) {
      // clone() is important!
      return res.clone().json().then((json) => {
        const { code } = json;
        if (!isValidCode(code)) {
          console.warn('[FetchWrapper] wrong business logic: code is ', code);
          next(new Error(code));
          return;
        }
        next(res);
      });
    }
    next(res);
  });

  // extend a download method
  r.download = function(method, url, params, roption) {
    const middlewareId = "my_download"

    operation1.pause(middlewareId);

    const operation2 = r.use(Requester.REQUEST, (req, next) => {
      req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
      next(req);
    }, middlewareId);
    
    return Requester.prototype[method.toLowerCase()]
      .call(r, url, params, mergeWith(roption, { middlewareId, catchError: false }))
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
          operation2.unuse();
          operation1.resume(middlewareId);
        }
      );
  };

  return r;
};

export default wrapper;
