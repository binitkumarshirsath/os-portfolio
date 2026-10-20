"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useLastTurn } from "@/entities/agent-trace";
import { useIsDesktop } from "@/shared/lib";
import { replaySteps } from "../model/replay";
import { walkthroughSteps } from "../model/steps";
import { useStepPlayer } from "../model/use-step-player";
import { ModeSwitch, type Mode } from "./mode-switch";
import { PageHeader } from "./page-header";
import { StepCard } from "./step-card";
import { StepControls } from "./step-controls";
import { StepList } from "./step-list";

// React Flow measures the DOM, so it only renders in the browser.
const FlowCanvas = dynamic(() => import("./flow-canvas").then((m) => m.FlowCanvas), {
  ssr: false,
});

const tourOverview = {
  title: "Follow one question through the system",
  text: "Press play to watch a question travel from the chat box to the answer, or pick any step. Every box is a real part of this site.",
};

/** The /ai-agent page: the diagram, and a guided tour or replay beside it. */
export function ArchitectureView() {
  const isDesktop = useIsDesktop();
  const lastTurn = useLastTurn();
  const [mode, setMode] = useState<Mode>("tour");
  const [showTechnical, setShowTechnical] = useState(false);

  const isReplay = mode === "replay" && lastTurn !== null;
  const steps = useMemo(
    () => (isReplay ? replaySteps(lastTurn) : walkthroughSteps),
    [isReplay, lastTurn],
  );
  const player = useStepPlayer(steps);

  function changeMode(next: Mode) {
    setMode(next);
    player.reset();
  }

  const overview = isReplay
    ? {
        title: "Your last question, replayed",
        text: `“${lastTurn.question}”. Press play to watch it run with its real timings, slowed down so you can follow along.`,
      }
    : tourOverview;

  return (
    <div className="flex h-dvh flex-col">
      <PageHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Boxes aren't focusable; the step list beside the diagram is its keyboard and screen-reader route. */}
        <section
          aria-label="Architecture diagram"
          className="relative min-h-0 flex-1 border-line max-lg:border-b"
        >
          {isDesktop !== null && (
            <FlowCanvas
              key={isDesktop ? "wide" : "tall"}
              layout={isDesktop ? "wide" : "tall"}
              step={player.step}
            />
          )}
        </section>
        <aside className="flex shrink-0 flex-col gap-5 *:shrink-0 overflow-y-auto bg-surface p-5 max-lg:max-h-[52dvh] lg:w-[400px] lg:border-l lg:border-line">
          <ModeSwitch
            mode={isReplay ? "replay" : "tour"}
            hasReplay={lastTurn !== null}
            onChange={changeMode}
          />
          <StepCard
            step={player.step}
            index={player.index}
            total={steps.length}
            isPlaying={player.isPlaying}
            showTechnical={showTechnical}
            overview={overview}
          />
          <StepControls player={player} />
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input
              type="checkbox"
              checked={showTechnical}
              onChange={(event) => setShowTechnical(event.target.checked)}
              className="size-4 accent-accent"
            />
            Show technical details
          </label>
          <section aria-label="All steps" className="border-t border-line pt-4">
            <StepList steps={steps} activeIndex={player.index} onSelect={player.goTo} />
          </section>
        </aside>
      </div>
    </div>
  );
}
