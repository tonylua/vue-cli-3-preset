import qs from 'qs';
import {
  mergeWith, omit, keys, map, filter, assign, findIndex
} from 'lodash';

const TIMEOUT_EXCEPTION = 'fetch timeout!';

function Requester(option) {
  Object.defineProperties(this, {
    _midIdFlag: {
      value: 0,
      enumerable: true,
      configurable: true,
      writable: true
    },
    _mids: {
      value: [],
      enumerable: false,
      configurable: true,
    },
    _globalOption: {
      value: option,
      enumerable: false,
      configurable: true,
    },
  });
}

Requester.REQUEST = '__req__';
Requester.RESPONSE = '__res__';

Requester.prototype = {
  constructor: Requester,

  _getMiddlewares(type) {
    const f = filter(this._mids, m => m.type === type);
    return f.length
      ? map(f, m => m.middleware)
      : null;
  },

  _parseMiddlewares(mids, cloneableObj) {
    if (!mids) {
      return Promise.resolve(cloneableObj);
    }
    // eslint-disable-next-line no-unused-vars
    return new Promise(((resolve, reject) => {
      const next = (obj) => {
        const rtn = typeof obj.clone === 'function'
          ? obj.clone()
          : obj;
        if (!mids.length) {
          return resolve(rtn);
        }
        const mw = mids.shift();
        mw(rtn, next);
      };
      next(cloneableObj);
    }));
  },

  _parseRequestMiddlewares(req) {
    const reqMids = this._getMiddlewares(Requester.REQUEST);
    return this._parseMiddlewares(reqMids, req);
  },

  _parseResponseMiddlewares(res) {
    const resMids = this._getMiddlewares(Requester.RESPONSE);
    return this._parseMiddlewares(resMids, res);
  },

  _doRequest(method) {
    if (typeof method === 'undefined') method = 'get';
    method = method.toUpperCase();

    return function(url, params, option) {
      if (typeof params === 'undefined' || !params) params = {};
      if (typeof option === 'undefined' || !option) option = {};

      // merge option
      option = mergeWith({
        method,
        credentials: 'include',
        mode: 'cors',
        cache: 'reload',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 30000,
      }, this._globalOption, option);

      // clear headers
      if (option.headers) {
        keys(option.headers).forEach((key) => {
          const hVal = option.headers[key];
          if (typeof hVal === 'undefined'
            || hVal === null
            || (typeof hVal === 'string' && hVal === '')) {
            delete option.headers[key];
          }
        });
      }

      // make data
      option = omit(option, 'body');
      const needBody = !/^(get|delete|head|options)$/i.test(method);
      const sendJSON = option.headers && option.headers['Content-Type'] === 'application/json';
      if (needBody) {
        option.body = sendJSON ? JSON.stringify(params) : params;
      } else {
        const strParam = qs.stringify(params);
        if (strParam.length) {
          const divSign = ~url.indexOf('?') ? '&' : '?';
          url += divSign + strParam;
        }
      }

      // timeout support
      if ('timeout' in option
        && !Number.isNaN(parseInt(option.timeout, 10))
        && window.fetch._timeoutSupport !== 1) {
        console.log('redefine fetch');
        window.fetch = (function() {
          const _fetch = window.fetch;
          const toFetch = function() {
            const fetchPromise = _fetch(...arguments);
            const timeoutPromise = new Promise((res, rej) => {
              setTimeout(
                () => rej(new Error(TIMEOUT_EXCEPTION)),
                option.timeout
              );
            });
            return Promise.race([fetchPromise, timeoutPromise]);
          };
          toFetch._timeoutSupport = 1;
          return toFetch;
        }());
      }

      // request middlewares
      const req = new Request(url, option);
      return this._parseRequestMiddlewares(req).then(
        // send request
        request => window.fetch(request).then(
          // response middlewares
          res => this._parseResponseMiddlewares(res)
        ).catch((ex) => {
          if (ex.message === TIMEOUT_EXCEPTION) {
            ex.isTimeout = true;
          }
          // console.log(111, ex.isTimeout)
          throw ex;
        })
      );
    };
  },

  use(type, middleware) {
    if (!type || typeof type !== 'string') return;
    if (!middleware || typeof middleware !== 'function') return;

    const id = this._midIdFlag++;

    this._mids.push({
      id,
      type,
      middleware,
    });

    return () => this.unuse(id);
  },

  unuse(id) {
    const idx = findIndex(this._mids, { id });
    if (idx < 0) return;
    this._mids.splice(idx, 1);
  },

  get() {
    return this._doRequest('get').apply(this, arguments);
  },

  post() {
    return this._doRequest('post').apply(this, arguments);
  },

  delete() {
    return this._doRequest('delete').apply(this, arguments);
  },

  put() {
    return this._doRequest('put').apply(this, arguments);
  },

  patch() {
    return this._doRequest('patch').apply(this, arguments);
  },

  sequence(requestPromiseArr, autoMergeResult = true) {
    const results = [];
    return requestPromiseArr.reduce(
      (promise, req) => promise.then(
        () => req.then(result => results.push(result)).catch(ex => Promise.reject(ex))
      ), Promise.resolve()
    ).then(
      () => (autoMergeResult
        ? results.reduce((rst, curr) => assign(rst, curr), {})
        : results)
    );
  }
};

Object.keys(Requester.prototype)
  .filter(key => (key === 'constructor') || /^_/.test(key))
  .forEach((privateKey) => {
    Object.defineProperty(Requester.prototype, privateKey, {
      enumerable: false,
      configurable: false,
    });
  });

export default Requester;
