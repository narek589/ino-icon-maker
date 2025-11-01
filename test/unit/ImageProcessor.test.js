/**
 * ImageProcessor Unit Tests
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { ImageProcessor } from "../../lib/core/ImageProcessor.js";
import { getTestIcon, cleanupDir, TEST_OUTPUT_DIR } from "../setup.js";
import path from "path";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";

describe("ImageProcessor", () => {
	let imageProcessor;
	let testOutputDir;

	beforeEach(async () => {
		imageProcessor = new ImageProcessor();
		testOutputDir = path.join(TEST_OUTPUT_DIR, "image-processor");
		await cleanupDir(testOutputDir);
		await mkdir(testOutputDir, { recursive: true });
	});

	afterEach(async () => {
		await cleanupDir(testOutputDir);
	});

	describe("Image Loading", () => {
		test("should load valid PNG image", async () => {
			const iconPath = getTestIcon();
			const result = await imageProcessor.loadImage(iconPath);
			expect(result).toBeDefined();
			expect(result.image).toBeDefined();
			expect(result.metadata).toBeDefined();
		});

		test("should throw error for non-existent image", async () => {
			await expect(
				imageProcessor.loadImage("non-existent.png")
			).rejects.toThrow();
		});

		test("should throw error for invalid image file", async () => {
			const invalidPath = path.join(testOutputDir, "invalid.txt");
			const fs = await import("fs/promises");
			await fs.writeFile(invalidPath, "not an image");

			await expect(imageProcessor.loadImage(invalidPath)).rejects.toThrow();
		});
	});

	describe("Image Saving", () => {
		test("should save image to file", async () => {
			const iconPath = getTestIcon();
			const { image } = await imageProcessor.loadImage(iconPath);
			const outputPath = path.join(testOutputDir, "output.png");

			await imageProcessor.saveImage(image, outputPath);
			expect(existsSync(outputPath)).toBe(true);
		});
	});

	describe("Image Validation", () => {
		test("should validate PNG image", async () => {
			const iconPath = getTestIcon();
			const isValid = await imageProcessor.validateImageFormat(iconPath);
			expect(isValid).toBe(true);
		});

		test("should reject non-image file", async () => {
			const invalidPath = path.join(testOutputDir, "invalid.txt");
			const fs = await import("fs/promises");
			await fs.writeFile(invalidPath, "not an image");

			const isValid = await imageProcessor.validateImageFormat(invalidPath);
			expect(isValid).toBe(false);
		});

		test("should reject non-existent file", async () => {
			const isValid = await imageProcessor.validateImageFormat(
				"non-existent.png"
			);
			expect(isValid).toBe(false);
		});
	});

	describe("Image Creation", () => {
		test("should create solid color image", async () => {
			const colorImage = await imageProcessor.createSolidColorImage(
				512,
				512,
				"#FF0000"
			);

			expect(colorImage).toBeDefined();
			const metadata = await colorImage.metadata();
			expect(metadata.width).toBe(512);
			expect(metadata.height).toBe(512);
		});

		test("should handle hex color formats", async () => {
			const colorImage = await imageProcessor.createSolidColorImage(
				256,
				256,
				"#00FF00"
			);

			expect(colorImage).toBeDefined();
		});
	});
});
