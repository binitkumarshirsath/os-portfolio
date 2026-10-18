// Runs synchronously while the HTML is parsed, before first paint: on a repeat
// visit in the same tab session the boot screen is hidden before it's ever drawn.
// try/catch because sessionStorage throws when storage is blocked.
const script = `try{var k="binit-os:booted";if(sessionStorage.getItem(k))document.documentElement.classList.add("booted");sessionStorage.setItem(k,"1")}catch(e){}`;

/**
 * Inline <script> for <head>. The type swap is the pattern from Next's "preventing
 * flash before hydration" guide: the server sends a runnable script, the client
 * renders it inert, and suppressHydrationWarning accepts the difference.
 */
export function BootScript() {
  return (
    <script
      suppressHydrationWarning
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
