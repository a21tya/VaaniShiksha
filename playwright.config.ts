import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: "./tests", timeout: 90000, workers: 1, use: { baseURL: "http://127.0.0.1:3107", channel: "chrome", headless: true }, reporter: "list" });
