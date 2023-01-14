import TResponseStatus from './TResponseStatus'
import TCommand from './TCommand'

interface IRuntimeResponse {
  type: TCommand
  status: TResponseStatus
  message: any
}

export default IRuntimeResponse
