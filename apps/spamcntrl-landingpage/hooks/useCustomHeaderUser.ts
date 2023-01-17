import { useEffect, useState } from 'react'

export function useCustomHeaderUser() {
  const [email, setEmail] = useState<string | null>(null)

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : ''

  const checkHeadersUrl = `${origin}/api/headers`
  useEffect(() => {
    fetch(checkHeadersUrl)
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        if (json.hasHeaders) {
          setEmail(json.email)
        }
      })
  }, [])

  return [email]
}
