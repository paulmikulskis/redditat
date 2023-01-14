import { browser, Management } from "webextension-polyfill-ts";
import queryString from "query-string";
import { IUser, IVideo, TSubscriptionType } from "../models";
import { User } from "firebase/auth";
import IAPIResponse from "../models/IAPIResponse";

export async function getAPIHost() {
  const extensionInfo: Management.ExtensionInfo = await browser.management.get(
    browser.runtime.id
  );
  if (extensionInfo.installType === "development") {
    return `http://127.0.0.1:7000`;
  } else {
    return `https://api.spamcntrl.com/`;
  }
}

export async function getAuthYoutubeURL(id: string) {
  const host = await getAPIHost();
  return `${host}/users/${id}/auth`;
}

export async function handleThen(res: any, resolve: Function, {} = {}) {
  if (res.ok) {
    const json = await res.json();
    console.log("log: api result", json);
    resolve(json);
  } else {
    resolve(null);
  }
}
export function handleError(err: any, resolve: Function, {} = {}) {
  console.error("log: api error", err);
  resolve(null);
}

export function _get(url: string, search?: object) {
  const fixedURL = `${url}${search ? "?" + queryString.stringify(search) : ""}`;
  console.log("log: api _get", fixedURL, url, search);
  return new Promise((resolve, reject) => {
    fetch(fixedURL)
      .then((res) => handleThen(res, resolve, reject))
      .catch((err) => handleError(err, resolve, reject));
  });
}

export function _post(url: string, body?: any) {
  console.log("log: api _post", url, body);
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => handleThen(res, resolve, reject))
      .catch((err) => handleError(err, resolve, reject));
  });
}

export function _delete(url: string, body?: any) {
  console.log("log: api _delete", url, body);
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => handleThen(res, resolve, reject))
      .catch((err) => handleError(err, resolve, reject));
  });
}

/**Start of backend api calls */
export async function newUser(user: User) {
  const host = await getAPIHost();
  return _post(`${host}/users/new`, {
    uuid: user.uid,
    id: user.uid,
    email: user.email,
  });
}

export async function viewUser(userId: string) {
  const host = await getAPIHost();
  return _get(`${host}/users/${userId}`) as Promise<IUser>;
}

export async function lastNVideos(userId: string, lastN: number) {
  const host = await getAPIHost();
  return _get(`${host}/users/${userId}/videos/last/${lastN}`).then(
    (res: any) => {
      console.log("log: res", res);
      if (res && res.status == 200) {
        return res.data;
      } else {
        return [];
      }
    }
  ) as Promise<IVideo[]>;
}

export async function updateSubscription(
  userId: string,
  days: number,
  subscriptionType: TSubscriptionType
) {
  const host = await getAPIHost();
  return _post(`${host}/users/${userId}/subscription`, {
    days: days,
    type: subscriptionType,
  }) as Promise<IAPIResponse>;
}
/**End of backend api calls */
