import { useState } from "react"

const useToggle = (defaultVal) => {
  const [value, setVal] = useState(defaultVal)

  function toggleValue(val) {
    setVal((prev) => (typeof val !== 'boolean' ? !prev : val))
  }

  return [value, toggleValue]
}

export default useToggle