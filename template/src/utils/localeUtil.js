// eslint-disable-next-line import/prefer-default-export
export const formatLocale = (loc) => { 
  if (loc === 'cn') {
    return 'zh-CN';
  } if (/^[a-z]{2,3}($|(-.*)?$)/.test(loc)) { // standard
    return loc;
  }
  return 'en-US'; // fallback
};
