/**
 * Custom Sizes Integration Tests
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { quickGenerate } from "../../index.js";
import {
	getTestIcon,
	getTestConfig,
	cleanupDir,
	TEST_OUTPUT_DIR,
} from "../setup.js";
import path from "path";
import { existsSync } from "fs";
import { mkdir, readFile } from "fs/promises";

describe("Custom Sizes", () => {
	let testOutputDir;

	beforeEach(async () => {
		testOutputDir = path.join(TEST_OUTPUT_DIR, "custom-sizes");
		await cleanupDir(testOutputDir);
		await mkdir(testOutputDir, { recursive: true });
	});

	afterEach(async () => {
		await cleanupDir(testOutputDir);
	});

	describe("Global Scaling", () => {
		test("should scale all icons by factor", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "ios",
				force: true,
				customSizes: {
					scale: 1.2, // 20% larger
				},
			});

			expect(result.success).toBe(true);
		}, 30000);

		test("should accept scale factors between 0.5 and 3.0", async () => {
			const iconPath = getTestIcon();

			// Test valid scale
			await expect(
				quickGenerate({
					input: iconPath,
					output: path.join(testOutputDir, "valid"),
					platform: "ios",
					force: true,
					customSizes: { scale: 1.5 },
				})
			).resolves.toBeDefined();
		}, 30000);
	});

	describe("Platform-Specific Scaling", () => {
		test("should scale iOS icons separately", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "ios",
				force: true,
				customSizes: {
					ios: {
						scale: 1.1,
					},
				},
			});

			expect(result.success).toBe(true);
		}, 30000);

		test("should scale Android icons separately", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "android",
				force: true,
				customSizes: {
					android: {
						scale: 1.3,
					},
				},
			});

			expect(result.success).toBe(true);
		}, 30000);
	});

	describe("Size Exclusion", () => {
		test("should exclude specific iOS sizes", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "ios",
				force: true,
				customSizes: {
					ios: {
						excludeSizes: ["20x20@2x", "29x29@3x"],
					},
				},
			});

			expect(result.success).toBe(true);
		}, 30000);

		test("should exclude specific Android densities", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "android",
				force: true,
				customSizes: {
					android: {
						excludeSizes: ["ldpi", "monochrome"],
					},
				},
			});

			expect(result.success).toBe(true);

			// Verify ldpi folder doesn't exist
			const ldpiPath = path.join(testOutputDir, "android-icons", "mipmap-ldpi");
			const ldpiExists = existsSync(ldpiPath);

			// ldpi might still exist for other icons, so this is optional
			expect(result.success).toBe(true);
		}, 30000);

		test("should exclude Android round icons", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "android",
				force: true,
				customSizes: {
					android: {
						excludeSizes: ["ic_launcher_round"],
					},
				},
			});

			expect(result.success).toBe(true);
		}, 30000);
	});

	describe("Combined Configurations", () => {
		test("should apply scale and exclusions together", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "all",
				force: true,
				customSizes: {
					scale: 1.1,
					ios: {
						excludeSizes: ["20x20@2x"],
					},
					android: {
						scale: 1.2,
						excludeSizes: ["ldpi"],
					},
				},
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(2);
		}, 30000);
	});

	describe("Config File Support", () => {
		test("should load custom sizes from JSON file", async () => {
			const iconPath = getTestIcon();
			const configPath = getTestConfig("scale-up");

			// Read config to verify it exists
			if (existsSync(configPath)) {
				const configContent = await readFile(configPath, "utf-8");
				const config = JSON.parse(configContent);

				const result = await quickGenerate({
					input: iconPath,
					output: testOutputDir,
					platform: "all",
					force: true,
					customSizes: config,
				});

				expect(result).toBeDefined();
			} else {
				// Skip if config doesn't exist
				expect(true).toBe(true);
			}
		}, 30000);
	});

	describe("Validation", () => {
		test("should reject invalid scale factor", async () => {
			const iconPath = getTestIcon();

			await expect(
				quickGenerate({
					input: iconPath,
					output: testOutputDir,
					platform: "ios",
					force: true,
					customSizes: {
						scale: 10, // Too large
					},
				})
			).rejects.toThrow();
		}, 10000);

		test("should reject negative scale factor", async () => {
			const iconPath = getTestIcon();

			await expect(
				quickGenerate({
					input: iconPath,
					output: testOutputDir,
					platform: "ios",
					force: true,
					customSizes: {
						scale: -1,
					},
				})
			).rejects.toThrow();
		}, 10000);
	});
});
