/**
 * Spread onto any link that leaves the portfolio, so the site stays open behind it.
 * `noreferrer` also stops the opened page from controlling this tab via window.opener.
 *
 * Resume links use it too: iOS Safari and some in-app browsers ignore `download`
 * and would otherwise replace the portfolio with the PDF.
 */
export const newTab = { target: "_blank", rel: "noreferrer" } as const;
