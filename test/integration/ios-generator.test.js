/**
 * iOS Generator Integration Tests
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { IOSGenerator } from "../../lib/platforms/IOSGenerator.js";
import { ImageProcessor } from "../../lib/core/ImageProcessor.js";
import { FileManager } from "../../lib/core/FileManager.js";
import { ArchiveManager } from "../../lib/core/ArchiveManager.js";
import {
	getTestIcon,
	cleanupDir,
	TEST_OUTPUT_DIR,
	countFilesInDir,
} from "../setup.js";
import path from "path";
import { existsSync } from "fs";
import { mkdir, readFile } from "fs/promises";

describe("IOSGenerator", () => {
	let generator;
	let testOutputDir;

	beforeEach(async () => {
		const imageProcessor = new ImageProcessor();
		const fileManager = new FileManager();
		const archiveManager = new ArchiveManager(fileManager);
		generator = new IOSGenerator(imageProcessor, fileManager, archiveManager);

		testOutputDir = path.join(TEST_OUTPUT_DIR, "ios-generator");
		await cleanupDir(testOutputDir);
		await mkdir(testOutputDir, { recursive: true });
	});

	afterEach(async () => {
		await cleanupDir(testOutputDir);
	});

	describe("Icon Generation", () => {
		test("should generate all iOS icons", async () => {
			const iconPath = getTestIcon();
			const result = await generator.generate(iconPath, testOutputDir, {
				force: true,
			});

			expect(result.success).toBe(true);
			expect(result.platform).toBe("ios");
			expect(result.files.length).toBeGreaterThan(0);
		}, 30000);

		test("should create AppIcon.appiconset directory", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const appiconsetPath = path.join(testOutputDir, "AppIcon.appiconset");
			expect(existsSync(appiconsetPath)).toBe(true);
		}, 30000);

		test("should generate Contents.json", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const contentsPath = path.join(
				testOutputDir,
				"AppIcon.appiconset",
				"Contents.json"
			);
			expect(existsSync(contentsPath)).toBe(true);

			// Validate JSON structure
			const contents = await readFile(contentsPath, "utf-8");
			const json = JSON.parse(contents);
			expect(json.images).toBeDefined();
			expect(Array.isArray(json.images)).toBe(true);
			expect(json.images.length).toBeGreaterThan(0);
		}, 30000);

		test("should generate correct number of icon files", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const appiconsetPath = path.join(testOutputDir, "AppIcon.appiconset");
			const pngCount = await countFilesInDir(appiconsetPath, ".png");

			// iOS generates 19 PNG files
			expect(pngCount).toBeGreaterThanOrEqual(15);
		}, 30000);

		test("should generate icons with correct naming convention", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const appiconsetPath = path.join(testOutputDir, "AppIcon.appiconset");
			const fs = await import("fs/promises");
			const files = await fs.readdir(appiconsetPath);

			const pngFiles = files.filter(f => f.endsWith(".png"));
			const validNames = pngFiles.every(f => f.startsWith("Icon-App-"));

			expect(validNames).toBe(true);
		}, 30000);
	});

	describe("ZIP Creation", () => {
		test("should create ZIP archive when zip option is true", async () => {
			const iconPath = getTestIcon();
			const result = await generator.generate(iconPath, testOutputDir, {
				force: true,
				zip: true,
			});

			expect(result.zipPath).toBeDefined();
			expect(existsSync(result.zipPath)).toBe(true);
			expect(result.zipPath.endsWith(".zip")).toBe(true);
		}, 30000);

		test("should not create ZIP when zip option is false", async () => {
			const iconPath = getTestIcon();
			const result = await generator.generate(iconPath, testOutputDir, {
				force: true,
				zip: false,
			});

			expect(result.zipPath).toBeNull();
		}, 30000);
	});

	describe("Error Handling", () => {
		test("should throw error for invalid input image", async () => {
			await expect(
				generator.generate("non-existent.png", testOutputDir, { force: true })
			).rejects.toThrow();
		});

		test("should handle existing files without force option", async () => {
			const iconPath = getTestIcon();

			// Generate once
			await generator.generate(iconPath, testOutputDir, { force: true });

			// Try to generate again without force - should throw error
			await expect(
				generator.generate(iconPath, testOutputDir, { force: false })
			).rejects.toThrow(/already exists/);
		}, 30000);
	});

	describe("Icon Sizes", () => {
		test("should generate 1024x1024 App Store icon", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const appStorePath = path.join(
				testOutputDir,
				"AppIcon.appiconset",
				"Icon-App-1024x1024@1x.png"
			);

			expect(existsSync(appStorePath)).toBe(true);

			// Verify dimensions
			const imageProcessor = new ImageProcessor();
			const { image } = await imageProcessor.loadImage(appStorePath);
			const metadata = await image.metadata();
			expect(metadata.width).toBe(1024);
			expect(metadata.height).toBe(1024);
		}, 30000);

		test("should generate @2x and @3x variants", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const appiconsetPath = path.join(testOutputDir, "AppIcon.appiconset");
			const fs = await import("fs/promises");
			const files = await fs.readdir(appiconsetPath);

			const has2x = files.some(f => f.includes("@2x"));
			const has3x = files.some(f => f.includes("@3x"));

			expect(has2x).toBe(true);
			expect(has3x).toBe(true);
		}, 30000);
	});
});
