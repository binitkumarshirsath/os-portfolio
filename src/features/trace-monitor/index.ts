/**
 * trace-monitor — the Activity Monitor window.
 * Draws the last agent turn as a span timeline (model steps and tool calls)
 * with latency and token totals. It only renders a trace it's given; the chat
 * records traces on the server and the page passes the latest one in.
 */
export { TraceMonitor } from "./ui/trace-monitor";
