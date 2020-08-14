import QuickFetch from "quickfetch";

export default function useTimeoutMiddleware(r: any) {
  // timeout
  r.use(QuickFetch.ERROR, (err: any, next: FetchNextMW) => {
    if (QuickFetch.EXCEPTION_TIMEOUT === err.message) {
      console.log(
        "%c[fetchWrapper] catch a error: ",
        "color: red",
        err.message,
        err.request
      );
    }
    next(err);
  });
}
