import router from './router';
import {
  abortPeddingFetches,
  updateTitle,
  updateBodyClass
} from './util';

// eslint-disable-next-line no-unused-vars
router.beforeEach((to, from, next) => {
  abortPeddingFetches();
  next();
});

router.afterEach(to => {
  // 更改标题
  updateTitle(to.meta.title);
  // 附加body样式
  updateBodyClass(to.path);
});

export default router;
