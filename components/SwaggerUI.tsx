"use client"

import { useEffect, useId } from "react"

export default function SwaggerUI({ url }: { url: string }) {
  const containerId = useId().replace(/:/g, "")

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      const mod = await import("swagger-ui-dist/swagger-ui-bundle")
      const SwaggerUIBundle = (mod as any).default ?? mod

      if (!isMounted) return

      SwaggerUIBundle({
        dom_id: `#${containerId}`,
        url,
        deepLinking: true,
        persistAuthorization: true,
        displayRequestDuration: true,
      })
    })()

    return () => {
      isMounted = false
    }
  }, [url, containerId])

  return (
    <div className="h-full w-full">
      <div id={containerId} />
    </div>
  )
}
