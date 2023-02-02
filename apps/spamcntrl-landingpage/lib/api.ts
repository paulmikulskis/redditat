import { IContactUsFormData } from "../pages/contact";
import { getOrigin } from "./html-util";

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
