import QuickFetch from 'quickfetch';

/**
 * 根据路由信息，改变浏览器标题
 * @example 如原title为“MySite”，切换页面后显示“MySite | Home”
 */
export const updateTitle = (metaTitle) => {
  const DIVIVE = ' | ';
  const exist = document.title.split(DIVIVE)[0];
  if (Array.isArray(metaTitle)) metaTitle = metaTitle.join(DIVIVE);
  document.title = [exist, metaTitle].filter(s => !!s).join(DIVIVE);
};

/**
 * 根据路由结果，在body上附加样式
 * @example 如将路由 /event/statistics 转化为 <body class="_page-event-statistics">
 */
export const updateBodyClass = (path) => {
  const exist = document.body.className.replace(/\s?_page-.*?(\s|$)/, '');
  const cls = path.replace(/^\//, '').replace(/\//g, '-');
  document.body.className = [exist, `_page-${cls}`].filter(s => !!s).join(' ');
};

/**
 * 中断未完成的不必要请求
 * @see src/utils/fetchWrapper/index.js
 */
export const abortPeddingFetches = () => {
  (window.abortFetchIds || []).forEach((fid, index) => {
    QuickFetch.abort(fid);
    window.abortFetchIds.splice(index, 1);
  });
};
