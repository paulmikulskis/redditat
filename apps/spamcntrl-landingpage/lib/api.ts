import { User } from "firebase/auth";
import { getOrigin } from "./html-util";
import queryString from "query-string";

export async function getAPIHost() {
  if (process.env.NODE_ENV == "production") {
    return `https://api.spamcntrl.com/`;
  } else {
    return `http://127.0.0.1:7000`;
  }
}

export function _get(url: string, search?: object, options?: RequestInit) {
  const fixedURL = `${url}${search ? "?" + queryString.stringify(search) : ""}`;
  console.log("log: api _get", fixedURL, url, search);
  return fetch(fixedURL, options);
}

export function _post(url: string, body?: any, options?: RequestInit) {
  console.log("log: api _post", url, body);
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });
}

export function _delete(url: string, body?: any, options?: RequestInit) {
  console.log("log: api _delete", url, body);
  return fetch(url, {
    method: "DELETE",
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });
}

export async function getAuthYoutubeURL(id: string) {
  const host = await getAPIHost();
  return `${host}/users/${id}/auth`;
}

export async function newUser(user: User) {
  const host = await getAPIHost();
  return _post(`${host}/users/new`, {
    uuid: user.uid,
    id: user.uid,
    email: user.email,
  });
}

/**
 *
 * @param data calls the serverless function for sending email
 * @returns Promise
 */
export async function sendEmail(data: any) {
  return new Promise((resolve, reject) => {
    const url = `${getOrigin()}/api/email`;
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status != 200) {
        reject(res.statusText);
      } else {
        resolve(res);
      }
    });
  });
}
