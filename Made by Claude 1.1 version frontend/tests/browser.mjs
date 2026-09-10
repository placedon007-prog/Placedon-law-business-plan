import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ?? "playwright"
);
const origin = process.env.TEST_ORIGIN ?? "http://localhost:3100";
const browser = await chromium.launch({ headless: true });
let assertions = 0;
function check(condition, message) {
  assert.ok(condition, message);
  assertions++;
}
const errors = [],
  outside = [];
await mkdir("verification-artifacts", { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (!request.url().startsWith(origin)) outside.push(request.url());
  });
  for (const route of [
    "/",
    "/product",
    "/how-it-works",
    "/pricing",
    "/security",
    "/about",
    "/faq",
    "/waitlist",
    "/privacy",
    "/terms",
    "/cookies",
    "/thank-you",
    "/missing",
  ]) {
    const response = await page.goto(origin + route);
    check(
      response.status() === (route === "/missing" ? 404 : 200),
      `${route} status`,
    );
    check((await page.locator("h1").count()) === 1, `${route} one heading`);
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${route} no viewport overflow`,
    );
    check(
      (await page.locator('meta[name="description"]').getAttribute("content"))
        .length <= 160,
      `${route} description length`,
    );
  }
  await page.goto(origin);
  await page.getByRole("button", { name: "Open navigation" }).click();
  check(await page.locator("#mobile-navigation").isVisible(), "Menu opens");
  await page.locator("#mobile-navigation a").first().focus();
  await page.keyboard.press("Escape");
  check(
    (await page.locator("#mobile-navigation").count()) === 0,
    "Menu escape",
  );
  await page.getByRole("button", { name: "Use dark appearance" }).click();
  check(
    (await page.locator("html").getAttribute("data-theme")) === "dark",
    "Dark appearance",
  );
  await page.reload();
  await page.getByRole("button", { name: "Use light appearance" }).waitFor();
  check(
    (await page.locator("html").getAttribute("data-theme")) === "dark",
    "Appearance persists",
  );
  await page.screenshot({
    path: "verification-artifacts/home-mobile-dark.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Use light appearance" }).click();
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  check(await page.getByRole("dialog").isVisible(), "Preferences open");
  await page
    .getByRole("button", { name: "Keep optional analytics off" })
    .click();
  check(
    (await page.getByRole("status").innerText()) ===
      "Optional analytics remains off.",
    "Analytics remains off",
  );
  await page.keyboard.press("Escape");
  check(!(await page.getByRole("dialog").isVisible()), "Dialog dismisses");
  await page.goto(origin + "/how-it-works");
  await page.getByRole("tab").first().focus();
  await page.keyboard.press("End");
  check(
    (await page
      .getByRole("tab", { name: "Abstained", exact: true })
      .getAttribute("aria-selected")) === "true",
    "Keyboard answer classes",
  );
  await page.goto(origin + "/faq");
  check(
    (await page.locator("details").count()) === 18,
    "All FAQ answers present",
  );
  await page.locator("summary").first().click();
  check(
    (await page.locator("details").first().getAttribute("open")) !== null,
    "FAQ expands",
  );
  await page.goto(origin + "/waitlist?intent=pilot");
  check(
    await page.locator("#email").isDisabled(),
    "Unconfigured intake disabled",
  );
  check(
    (await page.locator("#workflow").count()) === 1,
    "Pilot purpose applied",
  );
  check(
    (
      await page.request.post(origin + "/api/waitlist", { data: {} })
    ).status() === 503,
    "API closed independently",
  );
  const og = await page.request.get(origin + "/og/placedon.png");
  check(
    og.status() === 200 && og.headers()["content-type"].includes("image/png"),
    "Share image renders",
  );
  await page.goto(origin + "/og/placedon.png");
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.screenshot({ path: "verification-artifacts/og.png" });
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto(origin);
  await page.screenshot({
    path: "verification-artifacts/home-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.screenshot({
    path: "verification-artifacts/home-mobile.png",
    fullPage: true,
  });
  check(errors.length === 0, `No browser exceptions: ${errors.join("; ")}`);
  check(
    outside.length === 0,
    `No external tracking/font requests: ${outside.join("; ")}`,
  );
  console.log(`${assertions} browser assertions passed.`);
} finally {
  await browser.close();
}
