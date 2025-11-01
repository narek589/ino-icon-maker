/**
 * GenerationHelpers - Helper functions for CLI icon generation orchestration
 *
 * This module contains functions for coordinating the icon generation process
 * from the CLI. These functions handle the business logic for generation.
 *
 * Functions are organized to minimize side effects where possible
 */

import {
	generateIconsForPlatform,
	generateIconsForMultiplePlatforms,
	getSupportedPlatforms,
} from "../generator.js";
import { ProjectDetector } from "../core/ProjectDetector.js";
import { sizeConfigManager } from "../core/SizeConfigManager.js";
import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import { Platform } from "../core/ImageProcessor.js";

/**
 * Determine target platforms from platform option
 * @pure
 * @param {string} platform - Platform option (Platform.IOS, Platform.ANDROID, all)
 * @returns {Array<string>} Array of platform names
 */
export function determinePlatforms(platform = Platform.IOS) {
	return platform.toLowerCase() === Platform.All
		? getSupportedPlatforms()
		: [platform.toLowerCase()];
}

/**
 * Load custom size configuration from file
 * @param {string} configPath - Path to JSON config file
 * @returns {Promise<object|null>} Parsed config or null if not found
 */
export async function loadCustomSizeConfig(configPath) {
	try {
		const content = await fs.readFile(configPath, "utf-8");
		const config = JSON.parse(content);
		return config;
	} catch (error) {
		if (error.code === "ENOENT") {
			throw new Error(`Custom config file not found: ${configPath}`);
		}
		if (error instanceof SyntaxError) {
			throw new Error(`Invalid JSON in custom config file: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Build size customization from CLI options
 * @param {object} cliOptions - CLI options
 * @returns {Promise<object|null>} Size customization or null
 */
export async function buildSizeCustomization(cliOptions) {
	const { customConfig, exclude, platform } = cliOptions;

	// If custom config file provided, load it
	if (customConfig) {
		console.log(
			chalk.cyan(`📄 Loading custom size config from: ${customConfig}`)
		);
		return await loadCustomSizeConfig(customConfig);
	}

	// Build from CLI flags (only exclusions now, scale removed)
	const customization = sizeConfigManager.parseFromCLI({
		exclude,
		platform,
	});

	return customization;
}

/**
 * Build generation options object
 * @param {object} cliOptions - CLI options
 * @returns {Promise<object>} Generation options for generator
 */
export async function buildGenerationOptions(cliOptions) {
	const {
		force = false,
		zip = false,
		foreground,
		background,
		monochrome,
		fgScale,
		fgScaleIos,
		fgScaleAndroid,
	} = cliOptions;

	const options = {
		force,
		zip,
	};

	// Add adaptive icon configuration if provided
	if (foreground) {
		options.adaptiveIcon = {
			foreground,
			background: background || null, // null defaults to #111111
			monochrome,
		};
	}

	// Add foreground scale options if provided (scales content, not file size)
	if (fgScale || fgScaleIos || fgScaleAndroid) {
		options.fgScale = fgScale ? parseFloat(fgScale) : null;
		options.fgScaleIos = fgScaleIos ? parseFloat(fgScaleIos) : null;
		options.fgScaleAndroid = fgScaleAndroid ? parseFloat(fgScaleAndroid) : null;
	}

	// Add size customization if provided
	const customSizes = await buildSizeCustomization(cliOptions);
	if (customSizes) {
		options.customSizes = customSizes;
	}

	return options;
}

/**
 * Execute icon generation for platforms
 * @param {Array<string>} platforms - Platform names
 * @param {string|null} input - Input file path (null for adaptive mode)
 * @param {string} outputDir - Output directory
 * @param {object} options - Generation options
 * @returns {Promise<Array<object>>} Array of generation results
 */
export async function executeGeneration(platforms, input, outputDir, options) {
	const adaptiveMode = !!options.adaptiveIcon;

	if (platforms.length === 1) {
		// Single platform generation
		const result = await generateIconsForPlatform(
			platforms[0],
			adaptiveMode ? null : input,
			outputDir,
			options
		);
		return [result];
	}

	// Multiple platforms
	if (adaptiveMode) {
		// Generate each platform separately for adaptive mode
		const iosResult = await generateIconsForPlatform(
			Platform.IOS,
			null,
			outputDir,
			{
				force: options.force,
				zip: options.zip,
				...options,
			}
		);

		const androidResult = await generateIconsForPlatform(
			Platform.ANDROID,
			null,
			outputDir,
			options
		);

		return [iosResult, androidResult];
	}

	// Standard mode for multiple platforms
	return await generateIconsForMultiplePlatforms(
		platforms,
		input,
		outputDir,
		options
	);
}

/**
 * Calculate total icons generated
 * @pure
 * @param {Array<object>} results - Generation results
 * @returns {number} Total number of icons
 */
export function calculateTotalIcons(results) {
	return results.reduce((sum, r) => sum + (r.files ? r.files.length : 0), 0);
}

/**
 * Create generation summary message
 * @pure
 * @param {number} totalIcons - Total icons generated
 * @param {number} platformCount - Number of platforms
 * @returns {string} Formatted summary message
 */
export function createSummaryMessage(totalIcons, platformCount) {
	const pluralPlatforms = platformCount > 1 ? "s" : "";
	return `Successfully generated ${totalIcons} icons for ${platformCount} platform${pluralPlatforms}!`;
}

/**
 * Install icons to detected project (React Native or Flutter)
 * @param {string} generatedIconsPath - Path to generated icons
 * @param {object} options - Options
 * @returns {Promise<object|null>} Installation result
 */
export async function installToProject(generatedIconsPath, options = {}) {
	const detector = new ProjectDetector();
	const projectInfo = await detector.detectProject();

	if (!projectInfo) {
		return {
			success: false,
			message:
				"No React Native or Flutter project detected in current directory",
		};
	}

	console.log(
		chalk.cyan(
			`\n📱 Detected ${
				projectInfo.type === "react-native" ? "React Native" : "Flutter"
			} project: ${chalk.bold(projectInfo.name)}`
		)
	);

	const installPlan = detector.getInstallationPlan(
		projectInfo,
		generatedIconsPath
	);

	if (!installPlan || installPlan.installations.length === 0) {
		return {
			success: false,
			message: "No installation targets found",
		};
	}

	const installedPaths = [];

	for (const installation of installPlan.installations) {
		try {
			console.log(
				chalk.gray(
					`  Installing ${installation.platform.toUpperCase()} icons...`
				)
			);

			if (installation.platform === Platform.IOS) {
				// Install iOS icons
				await copyDirectory(installation.source, installation.target, true);
				installedPaths.push(installation.target);
				console.log(
					chalk.green(`  ✓ iOS icons installed to ${installation.target}`)
				);
			} else if (installation.platform === Platform.ANDROID) {
				// Install Android icons (copy mipmap directories)
				const sourceDirs = await fs.readdir(installation.source);
				const mipmapDirs = sourceDirs.filter(dir => dir.startsWith("mipmap-"));

				for (const mipmapDir of mipmapDirs) {
					const source = path.join(installation.source, mipmapDir);
					const target = path.join(installation.target, mipmapDir);
					await copyDirectory(source, target, false);
				}

				installedPaths.push(installation.target);
				console.log(
					chalk.green(`  ✓ Android icons installed to ${installation.target}`)
				);
			}
		} catch (error) {
			console.error(
				chalk.red(
					`  ✗ Failed to install ${installation.platform} icons: ${error.message}`
				)
			);
			return {
				success: false,
				message: `Failed to install ${installation.platform} icons: ${error.message}`,
			};
		}
	}

	return {
		success: true,
		projectType: projectInfo.type,
		projectName: projectInfo.name,
		installedPaths,
		message: `Icons installed successfully to ${projectInfo.type} project`,
	};
}

/**
 * Copy directory recursively
 * @param {string} source - Source directory
 * @param {string} target - Target directory
 * @param {boolean} deleteTarget - Whether to delete target first
 * @returns {Promise<void>}
 */
async function copyDirectory(source, target, deleteTarget = false) {
	// Delete target if requested
	if (deleteTarget) {
		try {
			await fs.rm(target, { recursive: true, force: true });
		} catch {
			// Ignore if doesn't exist
		}
	}

	// Create target directory
	await fs.mkdir(target, { recursive: true });

	// Copy all files
	const entries = await fs.readdir(source, { withFileTypes: true });

	for (const entry of entries) {
		const sourcePath = path.join(source, entry.name);
		const targetPath = path.join(target, entry.name);

		if (entry.isDirectory()) {
			await copyDirectory(sourcePath, targetPath, false);
		} else {
			await fs.copyFile(sourcePath, targetPath);
		}
	}
}
