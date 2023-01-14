import IChannel from './IChannel'
import IMetadata from './IMetadata'
import IPurging from './IPurging'
import ISubscription from './ISubscription'

export default interface IUser {
  uuid: string | undefined
  id: string | undefined
  email: string | undefined

  displayName?: string
  photoURL?: string | undefined | null

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
  channel?: IChannel
  metadata?: IMetadata | any
  subscription?: ISubscription
  purging?: IPurging
}
