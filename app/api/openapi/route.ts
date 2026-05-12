import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export const GET = async () => {
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "SmartNotes API",
      version: "0.1.0",
    },
    servers: [{ url: "/" }],
    paths: {
      "/api/notes": {
        post: {
          summary: "Create note",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateNoteRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/NoteResponse" },
                },
              },
            },
          },
        },
        put: {
          summary: "Update note",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateNoteRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/NoteResponse" },
                },
              },
            },
          },
        },
        delete: {
          summary: "Delete note",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeleteNoteRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Deleted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/NoteResponse" },
                },
              },
            },
          },
        },
      },
      "/api/chat": {
        post: {
          summary: "Chat (UI message SSE stream)",
          description:
            "Streams Server-Sent Events (SSE) using the AI SDK UI message stream protocol. This is not a JSON response.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChatRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "SSE stream of UI message chunks",
              content: {
                "text/event-stream": {
                  schema: { type: "string" },
                  examples: {
                    sse: {
                      summary: "Example SSE chunks",
                      value:
                        "data: {\"type\":\"text-start\",\"id\":\"t\"}\\n\\n" +
                        "data: {\"type\":\"text-delta\",\"id\":\"t\",\"delta\":\"Hello\"}\\n\\n" +
                        "data: {\"type\":\"text-end\",\"id\":\"t\"}\\n\\n",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Note: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            userId: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
          required: ["id", "title", "content", "userId"],
        },
        NoteResponse: {
          type: "object",
          properties: { note: { $ref: "#/components/schemas/Note" } },
          required: ["note"],
        },
        CreateNoteRequest: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
          required: ["title", "content"],
        },
        UpdateNoteRequest: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
          },
          required: ["id", "title", "content"],
        },
        DeleteNoteRequest: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
        ChatRequest: {
          type: "object",
          properties: {
            messages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  role: { type: "string", enum: ["system", "user", "assistant"] },
                  content: { type: "string" },
                  parts: { type: "array", items: { type: "object" } },
                  metadata: { type: "object" },
                },
                required: ["role"],
              },
            },
          },
          required: ["messages"],
        },
      },
    },
  } as const

  return NextResponse.json(spec)
}

