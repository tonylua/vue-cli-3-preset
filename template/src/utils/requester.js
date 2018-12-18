import qs from 'qs';
import {
  mergeWith, omit, keys, map, filter, assign, findIndex
} from 'lodash';

function _cloneObject(target) {
  return target && typeof target.clone === 'function'
    ? target.clone()
    : target;
};

/**
 * Requester
 * @description a fetch-based HTTP request tool
 * @class
 * @param {Object|null} [option] - an optional object for Request API
 * @param {string} [option.timeout=30000] - an optional timeout
 * @param {Boolean} [option.catchError=true] - optional, 
 *  if true then just parse error in middleware, otherwise throw it to endpoint
 */
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
    _originFetch: {
      value: window.fetch,
      enumerable: false,
      configurable: false,
      writable: false
    }
  });
}

Requester.REQUEST = '__req__';
Requester.RESPONSE = '__res__';
Requester.ERROR = '__err__';
Requester.EXCEPTION_TIMEOUT = '[Requester] fetch timeout';

Requester.prototype = {
  constructor: Requester,

  /**
   * @private
   * @param {String} type - Requester.REQUEST | Requester.RESPONSE | Requester.ERROR
   */
  _getMiddlewares(type) {
    const f = filter(this._mids, m => m.type === type);
    return f.length
      ? map(f, m => m.middleware)
      : null;
  },

  /**
   * @private
   * @param {Array} mids 
   * @param {Request|Response|JSON|Blob} target
   */
  _parseMiddlewares(mids, target) {
    if (!mids) {
      return Promise.resolve(_cloneObject(target));
    }
    // eslint-disable-next-line no-unused-vars
    return new Promise(((resolve, reject) => {
      const next = (obj) => {
        const rtn = _cloneObject(obj);
        if (!mids.length) {
          return resolve(rtn);
        }
        const mw = mids.shift();
        mw(rtn, next);
      };
      next(_cloneObject(target));
    }));
  },

  /**
   * @private
   * @param {Request} req
   * @param {string|number} [middlewareId]
   */
  _parseRequestMiddlewares(req, middlewareId) {
    let reqMids = this._getMiddlewares(Requester.REQUEST);
    if (middlewareId) {
      reqMids = filter(reqMids, mw => mw.middlewareId === middlewareId);
    }
    return this._parseMiddlewares(reqMids, req);
  },

  /**
   * @private
   * @param {Response} res
   * @param {string|number} [middlewareId]
   */
  _parseResponseMiddlewares(res, middlewareId) {
    let resMids = this._getMiddlewares(Requester.RESPONSE);
    if (middlewareId) {
      resMids = filter(resMids, mw => mw.middlewareId === middlewareId);
    }
    return this._parseMiddlewares(resMids, res);
  },

  /**
   * @private
   * @param {Error} err
   * @param {string|number} [middlewareId]
   */
  _parseErrorMiddlewares(err, middlewareId) {
    let errMids = this._getMiddlewares(Requester.ERROR);
    if (middlewareId) {
      errMids = filter(errMids, mw => mw.middlewareId === middlewareId);
    }
    return this._parseMiddlewares(errMids, err);
  },

  /**
   * regist a middleware
   * @param {string} type - Requester.REQUEST | Requester.RESPONSE | Requester.ERROR
   * @param {function} middleware - a function looks like '(req|res|err, next) => {}'
   * @param {string|number} [middlewareId] - a optional id for special requests
   * @returns {function} unuse
   */
  use(type, middleware, middlewareId) {
    if (!type || typeof type !== 'string') return;
    if (!middleware || typeof middleware !== 'function') return;

    const id = this._midIdFlag++;

    const mObj = {
      id,
      type,
      middleware
    };

    if (middlewareId && (typeof middlewareId === 'string' || typeof middlewareId === 'number')) {
      mObj.middlewareId = middlewareId;
    }

    this._mids.push(mObj);

    return {
      unuse: () => this._unuse(id),
      pause: (mId) => this._pause(id, mId),
      resume: (mId) => this._resume(id, mId)
    };
  },

  /**
   * @private
   * unregist a middleware
   * @param {number} id
   */
  _unuse(id) {
    if (typeof id === 'undefined') return;
    const idx = findIndex(this._mids, { id });
    if (idx < 0) return;
    this._mids.splice(idx, 1);

    console.log(`unregist middleware ${id}, new array length is ${this._mids.length}`);
  },

  /**
   * @private
   * pause a middleware
   * @param {number} id
   * @param {string|number} [middlewareId] - a optional id for special requests
   */
  _pause(id, middlewareId) {
    if (typeof id === 'undefined') return;
    const idx = findIndex(this._mids, { id });
    if (idx < 0) return;

    this._mids[idx].disabled = middlewareId
      ? this._mids[idx].middlewareId === middlewareId
        ? true
        : false
      : true;

    console.log(`pause middleware ${id} ${middlewareId ? 'for ' + middlewareId : ''}`);
  },

  /**
   * @private
   * resume a paused middleware
   * @param {number} id
   * @param {string|number} [middlewareId] - a optional id for special requests
   */
  _resume(id, middlewareId) {
    if (typeof id === 'undefined') return;
    const idx = findIndex(this._mids, { id });
    if (idx < 0) return;
    
    this._mids[idx].disabled = middlewareId
      ? this._mids[idx].middlewareId === middlewareId
        ? false
        : true
      : false;

    console.log(`resume middleware ${id} ${middlewareId ? 'for ' + middlewareId : ''}`);
  },

  /**
   * @private
   * @param {string} method - a HTTP verb
   * @param {function} a function to execute the real HTTP verb
   */
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
        catchError: true
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
      const needBody = !/^(get|head|options|delete)$/i.test(method);
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

      let _fetch = this._originFetch;

      // timeout support
      if ('timeout' in option
        && !Number.isNaN(parseInt(option.timeout, 10))) {
        _fetch = (() => {
          const toFetch = () => {
            const fetchPromise = this._originFetch.apply(null, arguments);
            // eslint-disable-next-line no-unused-vars
            const timeoutPromise = new Promise((resolve, reject) => {
              setTimeout(
                () => { reject(new Error(Requester.EXCEPTION_TIMEOUT)); },
                option.timeout
              );
            });
            return Promise.race([fetchPromise, timeoutPromise]);
          };
          return toFetch;
        })();
      }

      const req = new Request(url, option);
      
      return this._parseRequestMiddlewares(req, option.middlewareId).then(
        request => _fetch(request.clone()).then(
          res => this._parseResponseMiddlewares(res, option.middlewareId)
        ).catch((error) => {
          error.request = req.clone();
          return this._parseErrorMiddlewares(error, option.middlewareId);
        })
      ).then((obj) => {
        if (obj 
          && obj instanceof Error 
          && option.catchError) {
          throw obj;
        }
        return obj;
      });
    };
  },

  /**
   * make a GET fetch
   * @param {string} url
   * @param {Object|null} [params] - an optional params object
   * @param {Object|null} [option] - an optional object for Request API
   * @param {string} [option.timeout=30000] - an optional timeout
   * @param {Boolean} [option.catchError=true] - optional, 
   *  if true then just parse error in middleware, otherwise throw it to endpoint
   * @returns {Promise} a Promise that resolves to a Response object
   */
  get() {
    return this._doRequest('get').apply(this, arguments);
  },

  /**
   * make a POST fetch
   * @param {string} url
   * @param {Object|null} [params] - an optional params object
   * @param {Object|null} [option] - an optional object for Request API
   * @param {string} [option.timeout=30000] - an optional timeout
   * @param {Boolean} [option.catchError=true] - optional, 
   *  if true then just parse error in middleware, otherwise throw it to endpoint
   * @returns {Promise} a Promise that resolves to a Response object
   */
  post() {
    return this._doRequest('post').apply(this, arguments);
  },

  /**
   * make a DELETE fetch
   * @param {string} url
   * @param {Object|null} [params] - an optional params object
   * @param {Object|null} [option] - an optional object for Request API
   * @param {string} [option.timeout=30000] - an optional timeout
   * @param {Boolean} [option.catchError=true] - optional, 
   *  if true then just parse error in middleware, otherwise throw it to endpoint
   * @returns {Promise} a Promise that resolves to a Response object
   */
  delete() {
    return this._doRequest('delete').apply(this, arguments);
  },

  /**
   * make a PUT fetch
   * @param {string} url
   * @param {Object|null} [params] - an optional params object
   * @param {Object|null} [option] - an optional object for Request API
   * @param {string} [option.timeout=30000] - an optional timeout
   * @param {Boolean} [option.catchError=true] - optional, 
   *  if true then just parse error in middleware, otherwise throw it to endpoint
   * @returns {Promise} a Promise that resolves to a Response object
   */
  put() {
    return this._doRequest('put').apply(this, arguments);
  },

  /**
   * make a PATCH fetch
   * @param {string} url
   * @param {Object|null} [params] - an optional params object
   * @param {Object|null} [option] - an optional object for Request API
   * @param {string} [option.timeout=30000] - an optional timeout
   * @param {Boolean} [option.catchError=true] - optional, 
   *  if true then just parse error in middleware, otherwise throw it to endpoint
   * @returns {Promise} a Promise that resolves to a Response object
   */
  patch() {
    return this._doRequest('patch').apply(this, arguments);
  },

  /**
   * make batch requests
   * @param {Promise[]} requestPromiseArr
   * @param {Boolean} autoMergeResult
   * @returns {Object[]|Object}
   */
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
