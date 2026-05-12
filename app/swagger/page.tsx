import SwaggerUI from "@/components/SwaggerUI"
import "./swagger-ui.css"

export const metadata = {
  title: "SmartNotes API Docs",
}

export default function SwaggerPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl p-4">
        <h1 className="mb-3 text-xl font-semibold">API Docs</h1>
        <p className="mb-4 text-sm text-gray-600">
          OpenAPI spec is served from <code>/api/openapi</code>.
        </p>
        <SwaggerUI url="/api/openapi" />
      </div>
    </div>
  )
}
