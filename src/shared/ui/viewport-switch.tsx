"use client";

import type { ReactNode } from "react";
import { useIsDesktop } from "@/shared/lib";

type ViewportSwitchProps = {
  desktop: ReactNode;
  mobile: ReactNode;
};

/**
 * Server HTML contains both layouts and CSS shows the right one, so the first
 * paint is correct with no layout shift. After hydration the hidden layout is
 * unmounted, so stateful things like the chat only ever exist once.
 */
export function ViewportSwitch({ desktop, mobile }: ViewportSwitchProps) {
  const isDesktop = useIsDesktop();

  return (
    <>
      {isDesktop !== false && <div className="hidden lg:block">{desktop}</div>}
      {isDesktop !== true && <div className="lg:hidden">{mobile}</div>}
    </>
  );
}
