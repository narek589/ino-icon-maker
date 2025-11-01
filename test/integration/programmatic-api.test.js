/**
 * Programmatic API Integration Tests
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import {
	quickGenerate,
	generateIconsForPlatform,
	generateIconsForMultiplePlatforms,
	getSupportedPlatforms,
	getPlatformInfo,
	getAllPlatformsInfo,
	validateImageFile,
} from "../../index.js";
import {
	getTestIcon,
	getTestForeground,
	getTestBackground,
	cleanupDir,
	TEST_OUTPUT_DIR,
} from "../setup.js";
import path from "path";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";

describe("Programmatic API", () => {
	let testOutputDir;

	beforeEach(async () => {
		testOutputDir = path.join(TEST_OUTPUT_DIR, "programmatic-api");
		await cleanupDir(testOutputDir);
		await mkdir(testOutputDir, { recursive: true });
	});

	afterEach(async () => {
		await cleanupDir(testOutputDir);
	});

	describe("quickGenerate()", () => {
		test("should generate icons for all platforms", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "all",
				force: true,
			});

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(2); // iOS + Android
		}, 30000);

		test("should generate iOS icons only", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "ios",
				force: true,
			});

			expect(result.success).toBe(true);
			expect(result.platform).toBe("ios");
		}, 30000);

		test("should generate Android icons only", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "android",
				force: true,
			});

			expect(result.success).toBe(true);
			expect(result.platform).toBe("android");
		}, 30000);

		test("should create ZIP when zip option is true", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "ios",
				force: true,
				zip: true,
			});

			expect(result.zipPath).toBeDefined();
			expect(existsSync(result.zipPath)).toBe(true);
		}, 30000);

		test("should generate adaptive icons", async () => {
			const foregroundPath = getTestForeground();
			const backgroundPath = getTestBackground();

			const result = await quickGenerate({
				output: testOutputDir,
				platform: "android",
				force: true,
				adaptiveIcon: {
					foreground: foregroundPath,
					background: backgroundPath,
				},
			});

			expect(result.success).toBe(true);
		}, 30000);

		test("should throw error when missing required parameters", async () => {
			await expect(
				quickGenerate({
					// Missing input and output
				})
			).rejects.toThrow();
		});
	});

	describe("generateIconsForPlatform()", () => {
		test("should generate iOS icons", async () => {
			const iconPath = getTestIcon();

			const result = await generateIconsForPlatform(
				"ios",
				iconPath,
				testOutputDir,
				{ force: true }
			);

			expect(result.success).toBe(true);
			expect(result.platform).toBe("ios");
			expect(result.files).toBeDefined();
			expect(result.files.length).toBeGreaterThan(0);
		}, 30000);

		test("should generate Android icons", async () => {
			const iconPath = getTestIcon();

			const result = await generateIconsForPlatform(
				"android",
				iconPath,
				testOutputDir,
				{ force: true }
			);

			expect(result.success).toBe(true);
			expect(result.platform).toBe("android");
			expect(result.files).toBeDefined();
			expect(result.files.length).toBeGreaterThan(0);
		}, 30000);

		test("should throw error for unsupported platform", async () => {
			const iconPath = getTestIcon();

			await expect(
				generateIconsForPlatform("windows", iconPath, testOutputDir, {
					force: true,
				})
			).rejects.toThrow();
		});
	});

	describe("generateIconsForMultiplePlatforms()", () => {
		test("should generate icons for multiple platforms", async () => {
			const iconPath = getTestIcon();

			const results = await generateIconsForMultiplePlatforms(
				["ios", "android"],
				iconPath,
				testOutputDir,
				{ force: true }
			);

			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBe(2);
			expect(results[0].platform).toBe("ios");
			expect(results[1].platform).toBe("android");
		}, 30000);

		test("should handle single platform in array", async () => {
			const iconPath = getTestIcon();

			const results = await generateIconsForMultiplePlatforms(
				["ios"],
				iconPath,
				testOutputDir,
				{ force: true }
			);

			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBe(1);
		}, 30000);
	});

	describe("Utility Functions", () => {
		test("getSupportedPlatforms() should return platform list", () => {
			const platforms = getSupportedPlatforms();

			expect(Array.isArray(platforms)).toBe(true);
			expect(platforms.length).toBeGreaterThan(0);
			expect(platforms).toContain("ios");
			expect(platforms).toContain("android");
		});

		test("getPlatformInfo() should return platform details", () => {
			const iosInfo = getPlatformInfo("ios");

			expect(iosInfo).toBeDefined();
			expect(iosInfo.name).toBe("iOS");
			expect(iosInfo.key).toBe("ios");
		});

		test("getAllPlatformsInfo() should return all platform details", () => {
			const allInfo = getAllPlatformsInfo();

			expect(Array.isArray(allInfo)).toBe(true);
			expect(allInfo.length).toBeGreaterThan(0);
			expect(allInfo[0].name).toBeDefined();
		});

		test("validateImageFile() should validate PNG files", async () => {
			const iconPath = getTestIcon();
			const isValid = await validateImageFile(iconPath);

			expect(isValid).toBe(true);
		});

		test("validateImageFile() should reject non-existent files", async () => {
			const isValid = await validateImageFile("non-existent.png");

			expect(isValid).toBe(false);
		});

		test("validateImageFile() should reject non-image files", async () => {
			const textFile = path.join(testOutputDir, "test.txt");
			const fs = await import("fs/promises");
			await fs.writeFile(textFile, "not an image");

			const isValid = await validateImageFile(textFile);

			expect(isValid).toBe(false);
		});
	});

	describe("Error Handling", () => {
		test("should handle invalid input path gracefully", async () => {
			await expect(
				quickGenerate({
					input: "non-existent.png",
					output: testOutputDir,
					platform: "ios",
					force: true,
				})
			).rejects.toThrow();
		});

		test("should handle invalid output path gracefully", async () => {
			const iconPath = getTestIcon();

			await expect(
				quickGenerate({
					input: iconPath,
					output: "", // Empty output
					platform: "ios",
					force: true,
				})
			).rejects.toThrow();
		});
	});
});
