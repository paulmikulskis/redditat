import TNotifType from './TNotifType'

interface INotifData {
  alertKey?: string | number | undefined
  message: string
  type: TNotifType
  timeout?: NodeJS.Timeout
}

export default INotifData
