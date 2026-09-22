import { test, expect } from "@playwright/test";
import { validateOfflineKit } from "../lib/validate-offline-kit";

test("offline pages, unvisited books, query links, dictionary and imported PDF survive reload", async ({ page, context }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("/offline");
  await page.waitForFunction(() => document.documentElement.dataset.offlineNavigationReady === "true");
  await page.getByRole("button", { name: "Download / refresh app pages" }).click();
  await expect(page.locator("main [role=status]")).toContainText("All pages saved", { timeout: 60000 });
  await context.setOffline(true);
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.offlineNavigationReady === "true");
  await expect(page.locator(".home-stats")).toContainText("5Grade Levels");
  await page.goto("/learning/books/eesa1");
  await page.waitForFunction(() => document.documentElement.dataset.offlineNavigationReady === "true");
  await expect(page.getByRole("heading", { name: "Santoor", exact: true })).toBeVisible();
  await page.getByText("Other reading sources or import a PDF").click();
  await page.locator('input[type="file"]').setInputFiles({ name: "chapter.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%offline-reader-test\n%%EOF") });
  await expect(page.locator("main [role=status]")).toContainText("Imported PDF");
  await page.reload();
  await page.getByRole("button", { name: "Read chapter", exact: true }).click();
  await expect(page.locator("main [role=status]")).toContainText("PDF saved on this device");
  await page.goto("/learning/dictionary");
  await page.waitForFunction(() => document.documentElement.dataset.offlineNavigationReady === "true");
  await page.getByRole("searchbox").fill("water");
  await expect(page.getByRole("heading", { name: "Water", exact: true })).toBeVisible();
  await page.goto("/student?id=demo-counting");
  await page.waitForFunction(() => document.documentElement.dataset.offlineNavigationReady === "true");
  await expect(page.locator("main")).toContainText("Grade 1");
  const wav = Buffer.alloc(44 + 3200);
  wav.write("RIFF", 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(16000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write("data", 36); wav.writeUInt32LE(3200, 40);
  await page.getByText("Use a teacher’s audio recording offline").click();
  await page.locator('input[accept="audio/*"]').setInputFiles({ name: "test.wav", mimeType: "audio/wav", buffer: wav });
  await expect(page.locator("audio")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Listen in Santhali" }).click();
  await expect(page.locator("audio")).toBeVisible();
  await expect.poll(() => page.locator("audio").evaluate(audio => (audio as HTMLAudioElement).duration)).toBeGreaterThan(0);
  await page.goto("/create-lesson");
  await page.waitForFunction(() => document.documentElement.dataset.offlineNavigationReady === "true");
  await expect(page.locator("#generation-mode")).toHaveValue("device");
  await expect(page.locator('button[type="submit"]')).toBeEnabled();
  await page.goto("/offline");
  await page.waitForFunction(() => document.documentElement.dataset.offlineNavigationReady === "true");
  await expect(page.getByText("42 / 42 pages saved.", { exact: false })).toBeVisible();
  await page.screenshot({ path: "test-results/offline-desktop.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("mobile layout has all five classes and no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learning");
  await page.waitForFunction(() => document.documentElement.dataset.offlineNavigationReady === "true");
  await expect(page.getByRole("button", { name: "CLASS 5 Grow" })).toBeVisible();
  await page.getByRole("button", { name: "CLASS 5 Grow" }).click();
  await expect(page.getByRole("heading", { name: "Class 5, endless possibilities." })).toBeVisible();
  await page.goto("/offline");
  await page.waitForFunction(() => document.documentElement.dataset.offlineNavigationReady === "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: "test-results/offline-mobile.png", fullPage: true });
});

test("book API rejects unknown books and chapter traversal", async ({ request }) => {
  expect((await request.get("/api/books/missing/01")).status()).toBe(404);
  expect((await request.get("/api/books/aemr1/99")).status()).toBe(404);
});

test("local model output cannot silently mark invalid answers or empty lessons as ready", () => {
  const input = { title: "Plants", lessonText: "Plants need water.", grade: "Grade 5", subject: "EVS", sourceLanguage: "English", targetLanguage: "English" };
  expect(() => validateOfflineKit(null, input)).toThrow();
  expect(() => validateOfflineKit({ lesson: {} }, input)).toThrow();
  const kit = { lesson: { hindi: "source", santhali: "Plants need water.", romanization: "Plants need water.", simpleExplanation: "Water helps plants grow." }, vocabulary: [{ hindi: "water", santhali: "water", romanization: "water", meaning: "A liquid" }], flashcards: [{ front: "What do plants need?", back: "Water" }], quiz: [{ question: "What do plants need?", options: ["Water", "Plastic", "Metal", "Glass"], correctAnswer: "Water" }], activity: { title: "Look", instructions: "Look at a plant." } };
  expect(validateOfflineKit(kit, input).verificationStatus).toBe("needs_review");
  expect(() => validateOfflineKit({ ...kit, quiz: [null] }, input)).toThrow();
  expect(() => validateOfflineKit({ ...kit, quiz: [{ ...kit.quiz[0], correctAnswer: "Rock" }] }, input)).toThrow();
  expect(() => validateOfflineKit(kit, { ...input, targetLanguage: "Santhali" })).toThrow(/Ol Chiki/);
});
