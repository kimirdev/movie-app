import { useState, useEffect } from 'react'
import { debounce } from 'lodash'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedValue(value)
    }, delay)

    handler()

    return () => {
      handler.cancel()
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
