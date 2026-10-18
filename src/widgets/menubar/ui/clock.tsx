"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/shared/content";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: profile.timeZone,
});

function subscribe(onTick: () => void) {
  const timer = setInterval(onTick, 10_000);
  return () => clearInterval(timer);
}

const getTime = () => formatter.format(new Date());
// The server can't know the time the page will be read at, so it renders a blank.
const getServerTime = () => null;

export function Clock() {
  const time = useSyncExternalStore(subscribe, getTime, getServerTime);

  return (
    <span>
      <span className="text-fg-muted">BLR </span>
      <time aria-label={time ? `${time} in Bengaluru` : undefined}>
        {time ?? "--:--"}
      </time>
    </span>
  );
}
