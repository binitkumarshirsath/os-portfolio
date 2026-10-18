"use client";

import { JdMatchPanel } from "@/features/jd-match";
import { runUiAction } from "@/features/window-manager";
import { matchJobDescription } from "../model/match-job-description";

const showContact = () => runUiAction({ type: "showContact" });

export function JdMatchWindow() {
  return <JdMatchPanel onMatch={matchJobDescription} onContact={showContact} />;
}
