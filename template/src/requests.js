import Wrapper from '@/utils/fetchWrapper';

const fetchWrapper = new Wrapper({ timeout: 2000 });

// const noWarnHeader = (scope = 'all') => ({
//   'no-global-config-warn': scope
// });

export const testDelay = () => fetchWrapper.get(
  '/sample/delay',
  null
);

export const testHttp = () => fetchWrapper.get(
  '/sample/bad',
  null,
  { catchError: false }
);

export const testBusiness = () => fetchWrapper.get(
  '/sample/wrong',
  null
);

export const getInfo = () => fetchWrapper.get(
  '/sample/info',
  null
);

export const downFile = (filename) => fetchWrapper.download(
  'GET',
  '/sample/down',
  { filename }
);
