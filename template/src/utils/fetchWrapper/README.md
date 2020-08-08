# fetchWrapper

> 对 QuickFetch 库的业务化封装

- 接口返回值约定为 code, message, data 结构，200 为唯一的合法 code 值

## 1. 业务逻辑中间件 `wrongBusiness`

### 全局报错或提示

> 为简化每一处异步请求后单独编写的成功/警告/失败提示等，做出的配置约定

- 耦合 vuex，将从 `src/store/modules/global.js` 中和返回值的 message 中依次尝试获得提示内容
- 如果请求 headers 中有 `no-global-config-warn: 'all' | 'store' | 'success' | 'error'`，则会不同程度地忽略上一条的提示尝试
- 合法业务逻辑和全局提示策略的定义在 `busi.utils.ts` 中
- 需维护 `busi.utils.spec.js` 中的单元测试，用以保证以上定义的合法

### 跳过业务逻辑检查

> 对于某些特殊请求，允许其不遵循项目的返回值约定

- 如果请求中 `ignoreBusiCheck: true` 选项，则跳过整个业务逻辑检查

## 2. `middlewares` 目录中定义的其他中间件

1. `headers.js` 定义根据不同请求动态设置头部
2. `timeout.js` 定义请求最大尝试时间
3. `badHTTP.js` 根据响应的 HTTP 状态报错或跳转

- 除非请求中有 `ignoreHTTPCheck: true` 选项

## 3. 取消请求

> 耦合 vue-router，实现了路由切换后，中断过时请求的逻辑

- 除非请求中有 `ignoreAbortBeforeRoute: true` 选项

