import { TextEncoder } from "util"
import { format } from "date-fns"

export const getSizeInBytes = (obj: any) => {
  let str = null
  if (typeof obj === "string") {
    str = obj
  } else {
    str = JSON.stringify(obj)
  }
  const bytes = new TextEncoder().encode(str).length
  return bytes
}

export const getPrettyDate = () => {
  const m = new Date()
  return (
    m.getUTCFullYear() +
    "/" +
    (m.getUTCMonth() + 1) +
    "/" +
    m.getUTCDate() +
    " " +
    m.getUTCHours() +
    ":" +
    m.getUTCMinutes() +
    ":" +
    m.getUTCSeconds()
  )
}

export const dailyOf = (directory: string): string => {
  const dat = format(new Date(), "MM-dd-yyyy")
  return `${directory}/${dat}.json`
}

export const hourlyOf = (directory: string): string => {
  const dat = format(new Date(), "MM-dd-yyyy:HH")
  return `${directory}/${dat}.json`
}

export const minuteByMinuteOf = (directory: string): string => {
  const dat = format(new Date(), "MM-dd-yyyy:HH:mm")
  return `${directory}/${dat}.json`
}