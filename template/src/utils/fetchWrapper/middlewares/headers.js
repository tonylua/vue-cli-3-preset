import QuickFetch from 'quickfetch';
import VueCookie from 'vue-cookie';

export default function useHeadersMiddleware(r) {
  // 在每个请求发送之前，自动附加的headers，优先级高于请求定义时的
  r.use(QuickFetch.REQUEST, (req, next) => {
    // if (/\/kapis\//.test(req.url)
    //   || /\/apis\//.test(req.url)
    //   || /\/api\/v1\//.test(req.url)) {
    //   if (req.headers.get('Content-Type') !== 'application/merge-patch+json') {
    //     req.headers.set('Content-Type', 'application/json');
    //   }
    // } else {
    //   req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    //   req.headers.set('x-api-key', '5306de0f06d8b4598e81');
    // }
    next(req);
  });
}
