# fetchWrapper

> 对 QuickFetch 库的业务化封装

## `middlewares` 目录中定义的各种中间件：
 
- `headers.js` 定义根据不同请求动态设置头部
- `timeout.js` 定义请求最大尝试时间
- `badHTTP.js` 根据响应的 HTTP 状态报错或跳转
  * 除非请求中有 `ignoreHTTPCheck: true` 选项
- `wrongBusiness` 根据响应的业务逻辑报错或做出全局提示
  * 除非请求中有 `ignoreBusiCheck: true` 选项
  * 合法业务逻辑和全局提示策略的定义在 `busi.utils.js` 中
  * 需维护 `busi.utils.spec.js` 中的单元测试，用以保证以上定义的合法
- 耦合 vue-router，实现了路由切换时中断未完成的不必要请求的逻辑
  * 除非请求中有 `ignoreAbortBeforeRoute: true` 选项