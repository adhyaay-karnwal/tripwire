import { createFileRoute } from "@tanstack/react-router";
import { createMcpHandler } from "mcp-handler";
import { withMcpAuth } from "better-auth/plugins";
import { auth } from "#/lib/auth";
import { registerTripwireTools } from "#/lib/mcp/tools";
import { SERVER_INSTRUCTIONS } from "#/lib/mcp/instructions";

const handler = withMcpAuth(auth, (req, session) =>
	createMcpHandler(
		(server) => {
			registerTripwireTools(server, session.userId);
		},
		{
			capabilities: {
				tools: {},
			},
			instructions: SERVER_INSTRUCTIONS,
		},
		{
			basePath: "/api",
			verboseLogs: false,
			maxDuration: 60,
		},
	)(req),
);

export const Route = createFileRoute("/api/mcp")({
	server: {
		handlers: {
			GET: ({ request }) => handler(request),
			POST: ({ request }) => handler(request),
			DELETE: ({ request }) => handler(request),
		},
	},
});
