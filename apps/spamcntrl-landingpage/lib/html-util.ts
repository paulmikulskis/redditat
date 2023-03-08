import { IUser } from "../models/interfaces";

export function getOrigin() {
  return typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : "";
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
