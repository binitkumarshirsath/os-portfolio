// Exercises /api/chat validation and the per-visitor rate limit.
// Usage: npm run test:rate-limit            (against http://localhost:3000)
//        BASE_URL=https://your.site npm run test:rate-limit
//
// Each run pretends to be a new visitor (random IP), so it never touches your own
// hourly quota. It does use 10 of the site-wide daily budget per run.

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const fakeIp = `203.0.113.${Math.floor(Math.random() * 254) + 1}`; // TEST-NET-3, never a real visitor

const question = (text) => ({
  messages: [{ id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text }] }],
});

async function send(body, label) {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": fakeIp },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  const remaining = response.headers.get("x-ratelimit-remaining") ?? "-";
  const detail = response.ok ? "" : (await response.json()).error?.message;
  console.log(
    `${label.padEnd(28)} ${response.status}  remaining=${remaining.padEnd(3)} ${detail ?? ""}`,
  );
  if (response.ok) await response.body?.cancel();
  return response.status;
}

console.log(`Target ${BASE_URL}, pretending to be ${fakeIp}\n`);
console.log("Validation (should all be 400 and use no quota):");
await send("", "empty body");
await send("{not json", "malformed JSON");
await send(question("x".repeat(501)), "501-character question");
await send(question("   "), "blank question");

console.log("\nRate limit (expect 10 x 200, then 429):");
const statuses = [];
for (let i = 1; i <= 11; i++)
  statuses.push(await send(question("What's your best project?"), `request ${i}`));

const passed = statuses.slice(0, 10).every((s) => s === 200) && statuses[10] === 429;
console.log(
  `\n${passed ? "PASS" : "FAIL"}: the 11th request was ${passed ? "" : "not "}rate-limited.`,
);
process.exit(passed ? 0 : 1);
