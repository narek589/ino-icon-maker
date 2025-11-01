#!/usr/bin/env node

/**
 * Launcher Icon Generator - CLI Interface
 *
 * Generate iOS and Android app icon sets from a single source image
 * Supports: JPEG, JPG, PNG, WebP
 *
 * Provides both CLI and HTTP API interfaces with enhanced UX
 *
 * This file is the entry point for the CLI and only contains command
 * definitions. All logic is delegated to helper modules for better
 * maintainability and testability.
 */

import "dotenv/config";
import { Command } from "commander";
import chalk from "chalk";
import { createRequire } from "module";
import { getAllPlatformsInfo } from "./lib/generator.js";
import { showIconInfo, showPlatforms } from "./lib/cli/DisplayHelpers.js";
import { runInteractiveMode } from "./lib/cli/InteractiveHelpers.js";
import { generateWithProgress } from "./lib/cli/ProgressHelpers.js";
import { startServer } from "./lib/cli/ServerHelpers.js";

// Import package.json for version info (ES module compatible)
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

// ============================================================================
// CLI Command Definitions
// ============================================================================

const program = new Command();

program
	.name("ino-icon")
	.description(
		chalk.cyan(
			"Generate iOS and Android app icon sets from a single source image"
		)
	)
	.version(pkg.version, "-v, --version", "Show version number");

// Generate Command - Main icon generation
program
	.command("generate")
	.description("Generate icons from a source image")
	.option("-i, --input <path>", "Path to source image (for legacy mode or iOS)")
	.option("-o, --out <dir>", "Output directory (default: icons)", "icons")
	.option(
		"-p, --platform <platform>",
		"Target platform (ios, android, all)",
		"all"
	)
	.option("-z, --zip", "Create a ZIP archive of the generated icons")
	.option("-f, --force", "Overwrite existing output directory")
	.option(
		"-fg, --foreground <path>",
		"Foreground layer for Android adaptive icons"
	)
	.option(
		"-bg, --background <path>",
		"Background layer for adaptive icons (image file or hex color like #FF5722, defaults to #111111)"
	)
	.option(
		"-m, --monochrome <path>",
		"Monochrome layer for Android adaptive icons (optional)"
	)
	.option(
		"--install",
		"Auto-install icons to React Native or Flutter project (auto-detects project type)"
	)
	.option(
		"--fg-scale <factor>",
		"Scale foreground content inside icon (e.g., 2.0 for zoom in, 0.5 for zoom out)"
	)
	.option("--fg-scale-ios <factor>", "iOS-specific foreground content scale")
	.option("--fg-scale-android <factor>", "Android-specific foreground content scale")
	.option(
		"--exclude <sizes>",
		"Comma-separated sizes to exclude (e.g., 'ldpi,monochrome' or '20x20@2x')"
	)
	.option(
		"--custom-config <path>",
		"Path to JSON file with full size customization"
	)
	.action(async options => {
		await generateWithProgress(options);
	});

// Create Command - Quick create shorthand
program
	.command("create <image>")
	.description("Quick create - generate icons from image (output to ./icons)")
	.option("-o, --out <dir>", "Output directory", "./icons")
	.option(
		"-p, --platform <platform>",
		"Target platform (ios, android, all)",
		"all"
	)
	.option("-z, --zip", "Create a ZIP archive of the generated icons")
	.option("-f, --force", "Overwrite existing output directory")
	.option(
		"--install",
		"Auto-install icons to React Native or Flutter project (auto-detects project type)"
	)
	.option("--fg-scale <factor>", "Scale foreground content inside icon")
	.option("--fg-scale-ios <factor>", "iOS-specific foreground content scale")
	.option("--fg-scale-android <factor>", "Android-specific foreground content scale")
	.option("--exclude <sizes>", "Comma-separated sizes to exclude")
	.option(
		"--custom-config <path>",
		"Path to JSON file with full size customization"
	)
	.action(async (image, options) => {
		await generateWithProgress({
			input: image,
			out: options.out,
			platform: options.platform,
			zip: options.zip,
			force: options.force,
			install: options.install,
			fgScale: options.fgScale,
			fgScaleIos: options.fgScaleIos,
			fgScaleAndroid: options.fgScaleAndroid,
			exclude: options.exclude,
			customConfig: options.customConfig,
		});
	});

// Interactive Command - Guided wizard
program
	.command("interactive")
	.alias("i")
	.description("Interactive mode with prompts")
	.action(async () => {
		await runInteractiveMode(generateWithProgress);
	});

// Info Command - Show icon specifications
program
	.command("info")
	.description("Show information about generated icon sizes")
	.option(
		"-p, --platform <platform>",
		"Platform to show info for (ios, android, all)",
		"all"
	)
	.action(options => {
		showIconInfo(options.platform, getAllPlatformsInfo);
	});

// Platforms Command - List supported platforms
program
	.command("platforms")
	.alias("list")
	.description("List all supported platforms")
	.action(() => {
		showPlatforms(getAllPlatformsInfo);
	});

// Serve Command - Start HTTP API server
program
	.command("serve")
	.description("Start HTTP API server")
	.option("-p, --port <number>", "Port number", "3000")
	.action(options => {
		startServer(parseInt(options.port));
	});

// Show help if no command provided
if (process.argv.length <= 2) {
	program.help();
}

// Parse command line arguments
program.parse();
