import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../store/index";

import Popup from "./Popup";

import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

if (process.env.NODE_ENV == "production") {
  Sentry.init({
    dsn: "https://9a90b04ce31c48fc8a446ec24632631a@sentry.yungstentech.com/4",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

const container = document.getElementById("popup-root") as Element;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Popup />
  </Provider>
);
