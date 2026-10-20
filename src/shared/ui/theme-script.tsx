// A plain config module, not the "use client" theme hook: a server component
// importing a value from a client module would get a reference, not the string.
import { THEME_STORAGE_KEY } from "@/shared/config/theme";

// Runs while the HTML is parsed, before first paint, so the page never flashes the
// wrong theme: the saved choice if there is one, otherwise the system setting.
// try/catch because localStorage throws when storage is blocked.
const script = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}`;

/** Inline <script> for <head>; same pattern as the boot screen's script. */
export function ThemeScript() {
  return (
    <script
      suppressHydrationWarning
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
