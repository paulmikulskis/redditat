import { useState, useEffect, useRef } from 'react'

export default function useComponentVisible(
  initialIsVisible: boolean
): [
  React.MutableRefObject<any>,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const [isComponentVisible, setIsComponentVisible] =
    useState<boolean>(initialIsVisible)
  const ref = useRef<any>(null)

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, { capture: true })
    return () => {
      document.removeEventListener('click', handleClickOutside, {
        capture: true,
      })
    }
  }, [])

  return [ref, isComponentVisible, setIsComponentVisible]
}
