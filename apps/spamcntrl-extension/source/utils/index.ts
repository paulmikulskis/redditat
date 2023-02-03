import { User } from "firebase/auth";
import _ from "lodash";
import { browser } from "webextension-polyfill-ts";
import {
  IPaymentMethod,
  IRuntimeResponse,
  IStripeCustomer,
  IUser,
  TCommand,
  TSubscriptionType,
} from "../models";
import ICreatePayment from "../models/ICreatePayment";
import ILog from "../models/ILog";
import "./stripe-js";

export function runtimeSendMessage(
  command: TCommand,
  data: any
): Promise<IRuntimeResponse> {
  return browser.runtime.sendMessage({ command, data });
}

/**firebase functions */
export function login(email: string, password: string) {
  return runtimeSendMessage("login", { email, password });
}

export function auth() {
  return runtimeSendMessage("auth", {});
}

export function logout() {
  return runtimeSendMessage("logout", {});
}

export function signup(email: string, password: string) {
  return runtimeSendMessage("signup", { email, password });
}

export function resetPassword(email: string) {
  return runtimeSendMessage("resetPassword", { email });
}

export function login_google() {
  return runtimeSendMessage("login_google", {});
}

export function getUserFirebase(uid: string) {
  return runtimeSendMessage("getUserFirebase", uid);
}

export function stripeCustomersAddPaymentMethod(userId: string, paymentMethodId: string) {
  return runtimeSendMessage("stripeCustomersAddPaymentMethod", {
    userId,
    paymentMethodId,
  });
}

export function getStripeCustomer(userId: string): Promise<IStripeCustomer> {
  return runtimeSendMessage("getStripeCustomer", userId).then((res) => {
    if (res.status == "success") {
      return res.message as IStripeCustomer;
    } else {
      throw res.message;
    }
  });
}

export function getPaymentMethod(userId: string): Promise<IPaymentMethod[]> {
  return runtimeSendMessage("getPaymentMethod", userId).then((res) => {
    if (res.status == "success") {
      return res.message as IPaymentMethod[];
    } else {
      throw res.message;
    }
  });
}

export function createPayment(userId: string, paymentData: ICreatePayment) {
  return runtimeSendMessage("createPayment", { userId, paymentData });
}

export function getLogs(userId: string) {
  return runtimeSendMessage("getLogs", { userId });
}

/**helpers */
export function formatAmountForStripe(amount: number, currency: string) {
  return zeroDecimalCurrency(amount, currency) ? amount : Math.round(amount * 100);
}

function zeroDecimalCurrency(amount: number, currency: string) {
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency;
}

export function getDisplayName(user: IUser) {
  let displayName = "";
  if (user) {
    if (user.displayName) {
      displayName = user.displayName;
    } else {
      if (user.email) {
        displayName = user.email.split("@")[0];
      }
    }
  }

  return displayName;
}

export async function formatUser(
  user: IUser | null,
  userFirebase: User | null
): Promise<IUser | null> {
  if (!user) {
    return null;
  }
  const newUser = {
    ...user,
    displayName: getDisplayName(user),
    photoURL: userFirebase?.photoURL,
  };

  return Promise.resolve(newUser);
}

export function onPressEnter(e: any, cb: Function) {
  if (e.key == "Enter") {
    cb && cb();
  }
}

export async function getStripe() {
  const stripe = await Stripe(
    "pk_test_51HiY5HD35r3OCm55BASyoSQEt39SZxhvIvMlxGdZLzJsB7U9e4YoUjIj9S5UwTIT00ziyClqDeb8noPPjlIqzOeT00tbWmZZn8"
  );

  return stripe;
}

export function prependZero(num: number) {
  return num.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

export function getLastNDigits(num: number | string, nDigits: number = 2) {
  const nString = num + "";
  return nString.substring(nString.length - nDigits);
}

export function openLink(url: string, opt?: object) {
  return chrome.tabs.create({ url: url, active: false, ...opt });
}

export function hasYoutubeAuth(user: IUser) {
  return (
    user &&
    user.channel &&
    user.channel.auth.scope &&
    user.channel.auth.refresh_token &&
    user.channel.auth.expires_in != -1 &&
    user.channel.auth.scope.length > 0 &&
    user.channel.auth.refresh_token.length > 0
  );
}

export function getYoutubeImageFromVideoId(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export function getSubscriptionTypeFromUser(
  user: IUser | null | undefined
): TSubscriptionType | undefined {
  if (user == null || user == undefined) return "basic";

  const subscriptionType = user?.subscription?.type;
  const subscriptionDays = user?.subscription?.days;
  const subscriptionFreeTrial = subscriptionType == "premium" && subscriptionDays == 3;

  return subscriptionFreeTrial ? "freeTrial" : subscriptionType;
}

export function getSubscriptionLabelFromUser(user: IUser | null | undefined): string {
  if (user == null || user == undefined) return "";

  const subscriptionType = getSubscriptionTypeFromUser(user);

  switch (subscriptionType) {
    case "freeTrial":
      return "trial";
    case "premium":
      return "premium";
    case "basic":
    default:
      return "basic";
  }
}

export function searchByVideoNameOrLink(
  videoName: string,
  videoID: string,
  searchText: string
) {
  if (searchText == null || searchText == undefined) {
    return true;
  }

  const searchTextTrim = searchText.trim().toLowerCase();

  if (searchTextTrim.length == 0) {
    return true;
  }

  //video name search
  if (videoName.trim().toLowerCase().includes(searchTextTrim)) {
    return true;
  }

  //video link search
  if (searchText.includes(videoID)) {
    return true;
  }

  return false;
}

export function saveFileAs(text: string, filename: string) {
  let aData = document.createElement("a");
  aData.setAttribute("href", "data:text/plain;charset=urf-8," + encodeURIComponent(text));
  aData.setAttribute("download", filename);
  aData.click();
  if (aData.parentNode) aData.parentNode.removeChild(aData);
}

export function exportPurgingHistoryToCsv(
  logs: ILog[] | null | undefined
): Promise<string> {
  return new Promise((resolve, reject) => {
    const keys = logs && logs.length > 0 ? Object.keys(logs[0]) : [];

    if (keys.length == 0) {
      reject(`Error exporting purging history into csv file.`);
      return;
    }

    let csvText = keys.map((key) => `"${key}"`).join(",");

    _.each(logs, (log: any) => {
      const csvLines: any[] = [];
      _.each(keys, (k) => {
        csvLines.push(log[k]);
      });

      csvText += `\n${csvLines.map((l) => `"${l}"`).join(",")}`;
    });

    const filename = `U2ube Spam Purge - Purging History_${new Date().getTime()}.csv`;
    saveFileAs(csvText, filename);
    resolve(`Purging history was successfully exported to ${filename}`);
  });
}

export function getURL(srcPath: string): string {
  return chrome.runtime.getURL(srcPath);
}
