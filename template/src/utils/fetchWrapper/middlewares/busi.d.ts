declare module 'quickfetch';

declare type FetchResJSON = {
  code: number;
  message: string;
  data?: any;
};

declare type FetchErrorType = string | null;

declare type URLInTips = string | null;

declare type FetchNowarn = boolean | number | 'all' | 'success' | 'error' | 'store';

declare type FetchWarnMsg = boolean | number;

declare type FetchNextMW = (...args: any[]) => any;
