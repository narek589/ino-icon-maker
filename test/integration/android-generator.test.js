/**
 * Android Generator Integration Tests
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { AndroidGenerator } from "../../lib/platforms/AndroidGenerator.js";
import { ImageProcessor } from "../../lib/core/ImageProcessor.js";
import { FileManager } from "../../lib/core/FileManager.js";
import { ArchiveManager } from "../../lib/core/ArchiveManager.js";
import {
	getTestIcon,
	getTestForeground,
	getTestBackground,
	cleanupDir,
	TEST_OUTPUT_DIR,
	countFilesInDir,
} from "../setup.js";
import path from "path";
import { existsSync } from "fs";
import { mkdir, readdir } from "fs/promises";

describe("AndroidGenerator", () => {
	let generator;
	let testOutputDir;

	beforeEach(async () => {
		const imageProcessor = new ImageProcessor();
		const fileManager = new FileManager();
		const archiveManager = new ArchiveManager(fileManager);
		generator = new AndroidGenerator(
			imageProcessor,
			fileManager,
			archiveManager
		);

		testOutputDir = path.join(TEST_OUTPUT_DIR, "android-generator");
		await cleanupDir(testOutputDir);
		await mkdir(testOutputDir, { recursive: true });
	});

	afterEach(async () => {
		await cleanupDir(testOutputDir);
	});

	describe("Standard Icon Generation", () => {
		test("should generate all Android icons", async () => {
			const iconPath = getTestIcon();
			const result = await generator.generate(iconPath, testOutputDir, {
				force: true,
			});

			expect(result.success).toBe(true);
			expect(result.platform).toBe("android");
			expect(result.files.length).toBeGreaterThan(0);
		}, 30000);

		test("should create android-icons directory", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const androidIconsPath = path.join(testOutputDir, "android-icons");
			expect(existsSync(androidIconsPath)).toBe(true);
		}, 30000);

		test("should create all density folders", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const androidIconsPath = path.join(testOutputDir, "android-icons");
			const densities = ["ldpi", "mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"];

			for (const density of densities) {
				const densityPath = path.join(androidIconsPath, `mipmap-${density}`);
				expect(existsSync(densityPath)).toBe(true);
			}
		}, 30000);

		test("should generate launcher icons in each density", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const androidIconsPath = path.join(testOutputDir, "android-icons");
			const densities = ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"];

			for (const density of densities) {
				const launcherPath = path.join(
					androidIconsPath,
					`mipmap-${density}`,
					"ic_launcher.png"
				);
				expect(existsSync(launcherPath)).toBe(true);
			}
		}, 30000);

		test("should generate round launcher icons", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const androidIconsPath = path.join(testOutputDir, "android-icons");
			const roundPath = path.join(
				androidIconsPath,
				"mipmap-hdpi",
				"ic_launcher_round.png"
			);
			expect(existsSync(roundPath)).toBe(true);
		}, 30000);
	});

	describe("Adaptive Icon Generation", () => {
		test("should generate adaptive icons with foreground and background", async () => {
			const foregroundPath = getTestForeground();
			const backgroundPath = getTestBackground();

			const result = await generator.generate(foregroundPath, testOutputDir, {
				force: true,
				adaptiveIcon: {
					foreground: foregroundPath,
					background: backgroundPath,
				},
			});

			expect(result.success).toBe(true);
		}, 30000);

		test("should generate adaptive icons with background color", async () => {
			const foregroundPath = getTestForeground();

			const result = await generator.generate(foregroundPath, testOutputDir, {
				force: true,
				adaptiveIcon: {
					foreground: foregroundPath,
					background: "#FF5722",
				},
			});

			expect(result.success).toBe(true);
		}, 30000);

		test("should create mipmap-anydpi-v26 directory for adaptive icons", async () => {
			const foregroundPath = getTestForeground();
			const backgroundPath = getTestBackground();

			await generator.generate(foregroundPath, testOutputDir, {
				force: true,
				adaptiveIcon: {
					foreground: foregroundPath,
					background: backgroundPath,
				},
			});

			const anydpiPath = path.join(
				testOutputDir,
				"android-icons",
				"mipmap-anydpi-v26"
			);
			expect(existsSync(anydpiPath)).toBe(true);
		}, 30000);

		test("should generate XML files for adaptive icons", async () => {
			const foregroundPath = getTestForeground();

			await generator.generate(foregroundPath, testOutputDir, {
				force: true,
				adaptiveIcon: {
					foreground: foregroundPath,
					background: "#FF5722",
				},
			});

			const anydpiPath = path.join(
				testOutputDir,
				"android-icons",
				"mipmap-anydpi-v26"
			);
			const launcherXml = path.join(anydpiPath, "ic_launcher.xml");
			const roundXml = path.join(anydpiPath, "ic_launcher_round.xml");

			expect(existsSync(launcherXml)).toBe(true);
			expect(existsSync(roundXml)).toBe(true);
		}, 30000);

		test("should generate foreground layers for all densities", async () => {
			const foregroundPath = getTestForeground();

			await generator.generate(foregroundPath, testOutputDir, {
				force: true,
				adaptiveIcon: {
					foreground: foregroundPath,
					background: "#FFFFFF",
				},
			});

			const androidIconsPath = path.join(testOutputDir, "android-icons");
			const densities = ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"];

			for (const density of densities) {
				const foregroundIcon = path.join(
					androidIconsPath,
					`mipmap-${density}`,
					"ic_launcher_foreground.png"
				);
				expect(existsSync(foregroundIcon)).toBe(true);
			}
		}, 30000);

		test("should generate background layers for all densities", async () => {
			const foregroundPath = getTestForeground();
			const backgroundPath = getTestBackground();

			await generator.generate(foregroundPath, testOutputDir, {
				force: true,
				adaptiveIcon: {
					foreground: foregroundPath,
					background: backgroundPath,
				},
			});

			const androidIconsPath = path.join(testOutputDir, "android-icons");
			const densities = ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"];

			for (const density of densities) {
				const backgroundIcon = path.join(
					androidIconsPath,
					`mipmap-${density}`,
					"ic_launcher_background.png"
				);
				expect(existsSync(backgroundIcon)).toBe(true);
			}
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
	});

	describe("Error Handling", () => {
		test("should throw error for invalid input image", async () => {
			await expect(
				generator.generate("non-existent.png", testOutputDir, { force: true })
			).rejects.toThrow();
		});

		test("should handle invalid adaptive icon gracefully", async () => {
			const iconPath = getTestIcon();
			// Invalid adaptive config should fallback to standard generation
			const result = await generator.generate(iconPath, testOutputDir, {
				force: true,
				adaptiveIcon: {
					// Missing foreground - should fallback to standard mode
					background: "#FF5722",
				},
			});
			expect(result.success).toBe(true);
		}, 30000);
	});

	describe("Icon Sizes", () => {
		test("should generate correct sizes for each density", async () => {
			const iconPath = getTestIcon();
			await generator.generate(iconPath, testOutputDir, { force: true });

			const androidIconsPath = path.join(testOutputDir, "android-icons");
			const imageProcessor = new ImageProcessor();

			// Test a few key sizes
			const mdpiPath = path.join(
				androidIconsPath,
				"mipmap-mdpi",
				"ic_launcher.png"
			);
			const { image: mdpiImage } = await imageProcessor.loadImage(mdpiPath);
			const mdpiMetadata = await mdpiImage.metadata();
			expect(mdpiMetadata.width).toBe(48);

			const xxxhdpiPath = path.join(
				androidIconsPath,
				"mipmap-xxxhdpi",
				"ic_launcher.png"
			);
			const { image: xxxhdpiImage } = await imageProcessor.loadImage(
				xxxhdpiPath
			);
			const xxxhdpiMetadata = await xxxhdpiImage.metadata();
			expect(xxxhdpiMetadata.width).toBe(192);
		}, 30000);
	});
});
