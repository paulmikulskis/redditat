import ILog from './ILog'

interface IPurgeHistory {
  videoID: string
  name: string
  thumbnail: string
  comments: ILog[]
  status: string
  startDt: string | null | undefined
}

export default IPurgeHistory
