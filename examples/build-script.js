#!/usr/bin/env node

/**
 * Build Script Example
 *
 * This example demonstrates using ino-icon-maker in a build script
 * with environment-specific configurations.
 *
 * Run:
 *   NODE_ENV=development node examples/build-script.js
 *   NODE_ENV=production node examples/build-script.js
 */

import { quickGenerate, getSupportedPlatforms } from "../index.js";
import { existsSync } from "fs";
import { rm } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration for different environments
const CONFIG = {
	development: {
		icon: join(__dirname, "../docs/assets/ios-example.png"),
		output: join(__dirname, "../temp/build-dev"),
		platform: Platform.ALL,
		zip: false,
	},
	staging: {
		icon: join(__dirname, "../docs/assets/ios-example.png"),
		output: join(__dirname, "../temp/build-staging"),
		platform: Platform.ALL,
		zip: true,
	},
	production: {
		icon: join(__dirname, "../docs/assets/ios-example.png"),
		output: join(__dirname, "../temp/build-prod"),
		platform: Platform.ALL,
		zip: true,
	},
};

async function buildIcons() {
	const env = process.env.NODE_ENV || "development";
	const config = CONFIG[env];

	if (!config) {
		console.error(`❌ Unknown environment: ${env}`);
		console.log("Available environments:", Object.keys(CONFIG).join(", "));
		process.exit(1);
	}

	console.log(`🎨 Building ${env.toUpperCase()} icons\n`);

	// Validate icon exists
	if (!existsSync(config.icon)) {
		console.error(`❌ Icon not found: ${config.icon}`);
		process.exit(1);
	}

	try {
		// Clean output directory
		if (existsSync(config.output)) {
			console.log("🧹 Cleaning output directory...");
			await rm(config.output, { recursive: true, force: true });
		}

		// Show configuration
		console.log("📋 Configuration:");
		console.log(`   Environment: ${env}`);
		console.log(`   Icon: ${config.icon}`);
		console.log(`   Output: ${config.output}`);
		console.log(`   Platform: ${config.platform}`);
		console.log(`   Create ZIP: ${config.zip}`);
		console.log();

		// Generate icons
		console.log("⚙️  Generating icons...\n");
		const startTime = Date.now();

		const result = await quickGenerate({
			input: config.icon,
			output: config.output,
			platform: config.platform,
			zip: config.zip,
			force: true,
		});

		const duration = ((Date.now() - startTime) / 1000).toFixed(2);

		// Show results
		console.log(`\n✅ Icons generated successfully in ${duration}s\n`);

		console.log("📊 Results:");
		if (Array.isArray(result)) {
			for (const r of result) {
				console.log(`   ${r.platform.toUpperCase()}:`);
				console.log(`     - Icons: ${r.files.length}`);
				console.log(`     - Output: ${r.outputPath}`);
				if (r.zipPath) {
					console.log(`     - ZIP: ${r.zipPath}`);
				}
			}
		} else {
			console.log(`   ${result.platform.toUpperCase()}:`);
			console.log(`     - Icons: ${result.files.length}`);
			console.log(`     - Output: ${result.outputPath}`);
			if (result.zipPath) {
				console.log(`     - ZIP: ${result.zipPath}`);
			}
		}

		console.log("\n📦 Build Summary:");
		console.log(`   Environment: ${env}`);
		console.log(`   Status: Success`);
		console.log(`   Duration: ${duration}s`);
		console.log(`   Output: ${config.output}`);

		// Show next steps
		if (env === "production") {
			console.log("\n🚀 Next Steps:");
			console.log("   1. Review generated icons");
			console.log("   2. Test on real devices");
			console.log("   3. Deploy to app stores");
		}

		console.log();
	} catch (error) {
		console.error("\n❌ Build failed:", error.message);
		console.error("\nStack trace:", error.stack);
		process.exit(1);
	}
}

// Show usage if no environment set
if (!process.env.NODE_ENV) {
	console.log("💡 Usage:");
	console.log("   NODE_ENV=development node examples/build-script.js");
	console.log("   NODE_ENV=staging node examples/build-script.js");
	console.log("   NODE_ENV=production node examples/build-script.js");
	console.log();
}

buildIcons();
