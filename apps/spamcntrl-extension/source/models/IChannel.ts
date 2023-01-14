interface IChannel {
  auth: {
    access_token: string
    code: string
    expires_in: number
    refresh_token: string
    scope: string
    type: string
    updated: Date
  }
  email: string
  id: string
  joined: Date
}

export default IChannel
