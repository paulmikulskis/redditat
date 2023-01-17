import type { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authead = req.headers['Authorization']

  let hasHeaders: boolean = false
  let email: string | null = null

  const MYSTATS_AUTHKEY = process.env.MYSTATS_AUTHKEY

  if (authead) {
    const authKey = (<string>authead).split('-')[0]
    const statsPageUser = (<string>authead).split('-')[1]
    if (authKey === MYSTATS_AUTHKEY && MYSTATS_AUTHKEY.trim().length > 0) {
      hasHeaders = true
      email = statsPageUser
    }
  }

  res.status(200).json({ hasHeaders: hasHeaders, email: email })
}
