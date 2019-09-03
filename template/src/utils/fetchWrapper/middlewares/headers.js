import QuickFetch from 'quickfetch';

export default function useHeadersMiddleware(r) {
  // 在每个请求发送之前，自动附加的headers，优先级高于请求定义时的
  r.use(QuickFetch.REQUEST, (req, next) => {
    // req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    next(req);
  });
}
