#!/usr/bin/env node

/**
 * Adaptive Icons Example
 *
 * This example demonstrates generating Android adaptive icons
 * with foreground and background layers.
 *
 * Run: node examples/adaptive-icons.js
 *
 * Note: This example uses the same image for foreground and background
 * for demonstration purposes. In real projects, use separate images.
 */

import { quickGenerate } from "../index.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Platform } from "../lib/core/ImageProcessor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
	console.log("🎨 Android Adaptive Icons Example\n");

	const exampleImage = join(__dirname, "../docs/assets/ios-example.png");

	try {
		// Example 1: Foreground + Background Image
		console.log("Example 1: Foreground + Background Image");
		await quickGenerate({
			output: join(__dirname, "../temp/adaptive-images"),
			platform: Platform.ANDROID,
			force: true,
			adaptiveIcon: {
				foreground: exampleImage,
				background: exampleImage, // In real projects, use different image
			},
		});
		console.log("✅ Generated adaptive icons with image background\n");

		// Example 2: Foreground + Background Color
		console.log("Example 2: Foreground + Background Color");
		await quickGenerate({
			output: join(__dirname, "../temp/adaptive-color"),
			platform: Platform.ANDROID,
			force: true,
			adaptiveIcon: {
				foreground: exampleImage,
				background: "#FF5722", // Material Orange
			},
		});
		console.log("✅ Generated adaptive icons with color background\n");

		// Example 3: With Monochrome Layer
		console.log("Example 3: With Monochrome Layer");
		await quickGenerate({
			output: join(__dirname, "../temp/adaptive-monochrome"),
			platform: Platform.ANDROID,
			force: true,
			adaptiveIcon: {
				foreground: exampleImage,
				background: "#2196F3", // Material Blue
				monochrome: exampleImage, // In real projects, use monochrome version
			},
		});
		console.log("✅ Generated adaptive icons with monochrome layer\n");

		// Example 4: iOS + Android Adaptive
		console.log("Example 4: iOS + Android Adaptive (Mixed Mode)");
		await quickGenerate({
			input: exampleImage, // For iOS
			output: join(__dirname, "../temp/adaptive-mixed"),
			platform: Platform.ALL,
			force: true,
			adaptiveIcon: {
				// For Android
				foreground: exampleImage,
				background: "#4CAF50", // Material Green
			},
		});
		console.log("✅ Generated iOS standard + Android adaptive icons\n");

		console.log("✅ All adaptive icon examples completed successfully!");
		console.log("\nOutput directories:");
		console.log("  - temp/adaptive-images/");
		console.log("  - temp/adaptive-color/");
		console.log("  - temp/adaptive-monochrome/");
		console.log("  - temp/adaptive-mixed/");
		console.log("\n💡 Tip: In real projects, create separate:");
		console.log("  - Foreground layer (icon with transparency)");
		console.log("  - Background layer (solid color or image)");
		console.log("  - Monochrome layer (for themed icons, optional)");
	} catch (error) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();
