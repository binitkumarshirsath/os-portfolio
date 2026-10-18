import "server-only";
import { createHash } from "node:crypto";

const salt = process.env.IP_HASH_SALT ?? "";
if (!salt) {
  console.warn("[visitor-id] IP_HASH_SALT is not set; IP hashes are unsalted.");
}

/**
 * The first hop in x-forwarded-for is the visitor. On Vercel the platform sets
 * this header itself; behind any other host, make sure a trusted proxy does,
 * or visitors could pick their own rate-limit bucket.
 */
function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}

/** The rate-limit key: a salted SHA-256 of the IP, so raw IPs never reach Redis. */
export function visitorIdFrom(headers: Headers): string {
  return createHash("sha256")
    .update(`${salt}:${getClientIp(headers)}`)
    .digest("hex");
}
