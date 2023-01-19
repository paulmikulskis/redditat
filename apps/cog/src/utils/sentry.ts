import * as Sentry from "@sentry/node";
import { env } from "@yungsten/utils";

export const conditionallyConfigureSentry = () => {
  if (env.ENVIRONMENT === "production") {
    Sentry.init({
      dsn: "https://bc6e79eecca045debbb4193e3f972a86@sentry.yungstentech.com/3",

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });
  }
};

export function sentryException(
  err: Error,
  extra?: object,
  skipLogging: boolean = false
) {
  Sentry.withScope((scope) => {
    if (extra) {
      for (const key in extra) {
        scope.setExtra(key, extra[key]);
      }
    }
    Sentry.captureException(err);
  });
}
