import * as React from "react"

export function useSize(elementRef) {
  const [size, setSize] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    if (!elementRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })

    resizeObserver.observe(elementRef.current)
    return () => resizeObserver.disconnect()
  }, [elementRef])

  return size
}
