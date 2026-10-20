import type { Metadata } from "next";
import { ArchitectureView } from "@/widgets/agent-architecture";

export const metadata: Metadata = {
  title: "How the agent works · Binit OS",
  description:
    "An interactive diagram of the AI agent on Binit OS: validation, rate limiting, Groq with a Gemini fallback, tool calls, streaming and tracing.",
};

export default function AgentArchitecturePage() {
  return <ArchitectureView />;
}
