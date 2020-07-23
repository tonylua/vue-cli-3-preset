declare module 'quickfetch';

declare type FetchResJSON = {
  code: number;
  message: string;
  data?: object | Array<any>;
};

declare type FetchErrorType = string | null;

declare type URLInTips = string | null;

declare type FetchNowarn = boolean | number | 'all' | 'success' | 'error';

declare type FetchNextMW = (...args: any[]) => any;
