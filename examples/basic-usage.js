#!/usr/bin/env node

/**
 * Basic Usage Example
 *
 * This example demonstrates the simplest way to generate icons
 * for iOS and Android platforms.
 *
 * Run: node examples/basic-usage.js
 */

import { quickGenerate } from "../index.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Platform } from "../lib/core/ImageProcessor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
	console.log("🎨 Basic Icon Generation Example\n");

	try {
		// Example 1: Generate for all platforms
		console.log("Example 1: Generate for all platforms");
		await quickGenerate({
			input: join(__dirname, "../docs/assets/ios-example.png"), // Use example image
			output: join(__dirname, "../temp/basic-all"),
			platform: Platform.ALL,
			force: true,
		});
		console.log("✅ Generated icons for all platforms\n");

		// Example 2: Generate for iOS only
		console.log("Example 2: Generate for iOS only");
		await quickGenerate({
			input: join(__dirname, "../docs/assets/ios-example.png"),
			output: join(__dirname, "../temp/basic-ios"),
			platform: Platform.IOS,
			force: true,
		});
		console.log("✅ Generated iOS icons\n");

		// Example 3: Generate for Android only
		console.log("Example 3: Generate for Android only");
		await quickGenerate({
			input: join(__dirname, "../docs/assets/ios-example.png"),
			output: join(__dirname, "../temp/basic-android"),
			platform: Platform.ANDROID,
			force: true,
		});
		console.log("✅ Generated Android icons\n");

		// Example 4: Generate with ZIP archive
		console.log("Example 4: Generate with ZIP archive");
		const result = await quickGenerate({
			input: join(__dirname, "../docs/assets/ios-example.png"),
			output: join(__dirname, "../temp/basic-zip"),
			platform: Platform.ALL,
			zip: true,
			force: true,
		});
		console.log("✅ Generated icons with ZIP archive");
		if (result[0]?.zipPath) {
			console.log("   ZIP file:", result[0].zipPath);
		}
		console.log();

		console.log("✅ All examples completed successfully!");
		console.log("\nOutput directories:");
		console.log("  - temp/basic-all/");
		console.log("  - temp/basic-ios/");
		console.log("  - temp/basic-android/");
		console.log("  - temp/basic-zip/");
	} catch (error) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();
