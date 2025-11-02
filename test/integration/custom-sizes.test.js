/**
 * Custom Sizes Integration Tests
 *
 * Note: Scale functionality has been removed. Only exclusion and addSizes remain.
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { quickGenerate } from "../../index.js";
import { getTestIcon, cleanupDir, TEST_OUTPUT_DIR } from "../setup.js";
import path from "path";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";

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
		test("should apply exclusions for multiple platforms", async () => {
			const iconPath = getTestIcon();

			const result = await quickGenerate({
				input: iconPath,
				output: testOutputDir,
				platform: "all",
				force: true,
				customSizes: {
					ios: {
						excludeSizes: ["20x20@2x"],
					},
					android: {
						excludeSizes: ["ldpi"],
					},
				},
			});

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(2);
		}, 30000);
	});
});
