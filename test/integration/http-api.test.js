/**
 * HTTP API Integration Tests
 *
 * NOTE: These tests require the HTTP server to be running.
 * Run: npm run dev (or ino-icon serve) before running these tests
 */

import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import {
	getTestIcon,
	getTestForeground,
	getTestBackground,
	cleanupDir,
	TEST_OUTPUT_DIR,
} from "../setup.js";
import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";
const SERVER_TIMEOUT = 5000; // 5 seconds

// Helper to check if server is running
async function checkServerHealth() {
	try {
		const response = await fetch(`${BASE_URL}/`, {
			signal: AbortSignal.timeout(SERVER_TIMEOUT),
		});
		return response.ok;
	} catch (error) {
		return false;
	}
}

// Helper to upload file using Node.js native FormData
async function uploadFile(endpoint, filePath, additionalData = {}) {
	const fs = await import("fs/promises");
	const fileBuffer = await fs.readFile(filePath);
	const blob = new Blob([fileBuffer], { type: "image/png" });

	const form = new FormData();
	form.append("file", blob, path.basename(filePath));

	for (const [key, value] of Object.entries(additionalData)) {
		form.append(key, value);
	}

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		method: "POST",
		body: form,
		signal: AbortSignal.timeout(30000),
	});

	return response;
}

describe("HTTP API", () => {
	let serverRunning = false;
	let testOutputDir;

	beforeAll(async () => {
		serverRunning = await checkServerHealth();
		testOutputDir = path.join(TEST_OUTPUT_DIR, "http-api");
		await cleanupDir(testOutputDir);
		await mkdir(testOutputDir, { recursive: true });
	});

	afterAll(async () => {
		await cleanupDir(testOutputDir);
	});

	describe("Server Health", () => {
		test("should respond to root endpoint", async () => {
			if (!serverRunning) {
				console.log("⚠️  HTTP server not running. Start with: npm run dev");
				return;
			}

			const response = await fetch(`${BASE_URL}/`);
			expect(response.ok).toBe(true);
		}, 10000);

		test("should return platforms list", async () => {
			if (!serverRunning) return;

			const response = await fetch(`${BASE_URL}/platforms`);
			expect(response.ok).toBe(true);

			const data = await response.json();
			expect(data.success).toBe(true);
			expect(Array.isArray(data.platforms)).toBe(true);
			expect(data.platforms.length).toBeGreaterThan(0);
		}, 10000);
	});

	describe("Icon Generation", () => {
		test("should generate icons for all platforms", async () => {
			if (!serverRunning) return;

			const iconPath = getTestIcon();
			const response = await uploadFile("/generate", iconPath);

			expect(response.ok).toBe(true);
			expect(response.headers.get("content-type")).toContain("application/zip");

			// Save ZIP for inspection
			const arrayBuffer = await response.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const zipPath = path.join(testOutputDir, "all-icons.zip");
			await writeFile(zipPath, buffer);

			expect(existsSync(zipPath)).toBe(true);
		}, 30000);

		test("should generate iOS icons only", async () => {
			if (!serverRunning) return;

			const iconPath = getTestIcon();
			const response = await uploadFile("/generate?platform=ios", iconPath);

			expect(response.ok).toBe(true);

			const arrayBuffer = await response.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const zipPath = path.join(testOutputDir, "ios-icons.zip");
			await writeFile(zipPath, buffer);

			expect(existsSync(zipPath)).toBe(true);
		}, 30000);

		test("should generate Android icons only", async () => {
			if (!serverRunning) return;

			const iconPath = getTestIcon();
			const response = await uploadFile("/generate?platform=android", iconPath);

			expect(response.ok).toBe(true);

			const arrayBuffer = await response.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const zipPath = path.join(testOutputDir, "android-icons.zip");
			await writeFile(zipPath, buffer);

			expect(existsSync(zipPath)).toBe(true);
		}, 30000);
	});

	describe("Adaptive Icons", () => {
		test("should generate adaptive icons with background color", async () => {
			if (!serverRunning) return;

			const foregroundPath = getTestForeground();
			const fs = await import("fs/promises");

			const foregroundBuffer = await fs.readFile(foregroundPath);
			const foregroundBlob = new Blob([foregroundBuffer], { type: "image/png" });

			const form = new FormData();
			form.append("foreground", foregroundBlob, "foreground.png");

			const response = await fetch(
				`${BASE_URL}/generate?platform=android&backgroundColor=%23FF5722`,
				{
					method: "POST",
					body: form,
					signal: AbortSignal.timeout(30000),
				}
			);

			expect(response.ok).toBe(true);

			const arrayBuffer = await response.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const zipPath = path.join(testOutputDir, "adaptive-color.zip");
			await writeFile(zipPath, buffer);

			expect(existsSync(zipPath)).toBe(true);
		}, 30000);

		test("should generate adaptive icons with background image", async () => {
			if (!serverRunning) return;

			const foregroundPath = getTestForeground();
			const backgroundPath = getTestBackground();
			const fs = await import("fs/promises");

			const foregroundBuffer = await fs.readFile(foregroundPath);
			const backgroundBuffer = await fs.readFile(backgroundPath);
			const foregroundBlob = new Blob([foregroundBuffer], { type: "image/png" });
			const backgroundBlob = new Blob([backgroundBuffer], { type: "image/png" });

			const form = new FormData();
			form.append("foreground", foregroundBlob, "foreground.png");
			form.append("background", backgroundBlob, "background.png");

			const response = await fetch(`${BASE_URL}/generate?platform=android`, {
				method: "POST",
				body: form,
				signal: AbortSignal.timeout(30000),
			});

			expect(response.ok).toBe(true);

			const arrayBuffer = await response.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const zipPath = path.join(testOutputDir, "adaptive-image.zip");
			await writeFile(zipPath, buffer);

			expect(existsSync(zipPath)).toBe(true);
		}, 30000);
	});

	describe("Error Handling", () => {
		test("should reject request without file", async () => {
			if (!serverRunning) return;

			const response = await fetch(`${BASE_URL}/generate`, {
				method: "POST",
				signal: AbortSignal.timeout(10000),
			});

			expect(response.ok).toBe(false);
		}, 10000);

		test("should reject invalid platform", async () => {
			if (!serverRunning) return;

			const iconPath = getTestIcon();
			const response = await uploadFile("/generate?platform=invalid", iconPath);

			expect(response.ok).toBe(false);
		}, 10000);

		test("should handle invalid image file", async () => {
			if (!serverRunning) return;

			const textFile = path.join(testOutputDir, "invalid.txt");
			await writeFile(textFile, "not an image");

			const response = await uploadFile("/generate", textFile);

			expect(response.ok).toBe(false);
		}, 10000);
	});

	describe("Custom Sizes", () => {
		test("should accept customSizes parameter", async () => {
			if (!serverRunning) return;

			const iconPath = getTestIcon();
			const customSizes = JSON.stringify({
				android: { excludeSizes: ["ldpi"] },
			});

			const fs = await import("fs/promises");
			const fileBuffer = await fs.readFile(iconPath);
			const fileBlob = new Blob([fileBuffer], { type: "image/png" });

			const form = new FormData();
			form.append("file", fileBlob, "icon.png");
			form.append("customSizes", customSizes);

			const response = await fetch(`${BASE_URL}/generate?platform=ios`, {
				method: "POST",
				body: form,
				signal: AbortSignal.timeout(30000),
			});

			expect(response.ok).toBe(true);
		}, 30000);
	});
});
