/**
 * quick-actions — the chips under the chat greeting.
 * They never call the LLM: each one carries a pre-written answer built from
 * content plus a UiAction (the same shape the agent's tools produce). The
 * caller decides how to show the answer and run the action.
 */
export { QuickActionChips } from "./ui/quick-action-chips";
export { quickActions, type QuickAction } from "./model/quick-actions";
