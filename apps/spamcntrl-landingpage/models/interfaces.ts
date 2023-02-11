import { TPurgeType, TSubscriptionType } from "./types";

export interface IChannel {
  auth: {
    access_token: string;
    code: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    type: string;
    updated: Date;
  };
  email: string;
  id: string;
  joined: Date;
}

export interface IMetadata {
  videos_processed: number;
  videos_processing: number;
  videos_queued: number;
}

export interface ISubscription {
  days: number;
  start: Date;
  type: TSubscriptionType;
  trialExpired: Boolean;
}

interface IPurging {
  percentage: 0;
  type: TPurgeType;
}

export interface IUser {
  uuid: string | undefined;
  id: string | undefined;
  email: string | undefined;

  displayName?: string;
  photoURL?: string | undefined | null;

  // uid: string | undefined
  // emailVerified?: Boolean
  // createdAt?: string | number | undefined
  // apiKey?: string | undefined
  // appName?: string | undefined
  // isAnonymous?: Boolean
  // lastLoginAt?: string | number | undefined
  // providerData?: any
  // stsTokenManager?: any

  //backend data
  channel?: IChannel;
  metadata?: IMetadata | any;
  subscription?: ISubscription;
  purging?: IPurging;
}
