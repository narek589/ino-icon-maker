/**
 * IconGenerationHandler - Single Responsibility: Handle icon generation orchestration
 *
 * This class orchestrates the icon generation process for the HTTP API:
 * - Manages temporary directories
 * - Coordinates platform-specific generation
 * - Handles adaptive vs legacy mode generation
 * - Creates composites for iOS from adaptive layers
 *
 * Follows Open/Closed Principle: Easy to extend with new generation modes
 */

import path from "path";
import fs from "fs/promises";
import {
	generateIconsForPlatform,
	generateIconsForMultiplePlatforms,
} from "../generator.js";
import { ImageProcessor, Platform } from "../core/ImageProcessor.js";

export class IconGenerationHandler {
	constructor() {
		this.imageProcessor = new ImageProcessor();
	}

	/**
	 * Create temporary output directory
	 * @param {string} basePath - Base path for temp directories
	 * @returns {Promise<string>} Path to created directory
	 */
	async createTempOutputDir(basePath = "/tmp") {
		const tempDir = path.join(basePath, `icons-${Date.now()}`);
		await fs.mkdir(tempDir, { recursive: true });
		return tempDir;
	}

	/**
	 * Build generation options object
	 * @pure
	 * @param {object} modeInfo - Mode information from RequestValidator
	 * @param {object} files - Validated file paths
	 * @param {string} backgroundColor - Background color (optional)
	 * @param {object} customSizes - Custom size configuration (optional)
	 * @returns {object} Generation options
	 */
	buildGenerationOptions(
		modeInfo,
		files,
		backgroundColor = null,
		customSizes = null
	) {
		const options = {
			force: true,
			zip: true,
		};

		if (modeInfo.adaptiveMode) {
			options.adaptiveIcon = {
				foreground: files.foreground,
				background: files.background || backgroundColor || null,
				monochrome: files.monochrome || null,
			};
		}

		if (customSizes) {
			options.customSizes = customSizes;
		}

		return options;
	}

	/**
	 * Generate icons for single platform
	 * @param {string} platform - Platform name
	 * @param {string} inputFile - Input file path (null for adaptive mode)
	 * @param {string} outputDir - Output directory
	 * @param {object} options - Generation options
	 * @returns {Promise<object>} Generation result
	 */
	async generateForSinglePlatform(platform, inputFile, outputDir, options) {
		return await generateIconsForPlatform(
			platform,
			inputFile,
			outputDir,
			options
		);
	}

	/**
	 * Generate icons for multiple platforms
	 * @param {Array<string>} platforms - Platform names
	 * @param {string} inputFile - Input file path (null for adaptive mode)
	 * @param {string} outputDir - Output directory
	 * @param {object} options - Generation options
	 * @returns {Promise<Array<object>>} Array of generation results
	 */
	async generateForMultiplePlatforms(platforms, inputFile, outputDir, options) {
		return await generateIconsForMultiplePlatforms(
			platforms,
			inputFile,
			outputDir,
			options
		);
	}

	/**
	 * Generate iOS composite from adaptive layers
	 * @param {string} foregroundPath - Foreground layer path
	 * @param {string} backgroundPath - Background layer path or color
	 * @param {string} outputDir - Output directory
	 * @returns {Promise<string>} Path to composite image
	 */
	async createIosCompositeFromLayers(
		foregroundPath,
		backgroundPath,
		outputDir
	) {
		console.log(
			`\n🔨 Creating iOS composite from layers (background + centered foreground)...`
		);

		const composite = await this.imageProcessor.createCompositeFromLayers(
			foregroundPath,
			backgroundPath,
			1024 // 1024x1024 base size for iOS
		);

		const compositePath = path.join(outputDir, "ios-composite.png");
		await composite.png().toFile(compositePath);

		return compositePath;
	}

	/**
	 * Generate icons in legacy mode (single image for all platforms)
	 * @param {Array<string>} platforms - Platform names
	 * @param {string} inputFile - Input file path
	 * @param {string} outputDir - Output directory
	 * @param {object} options - Generation options
	 * @returns {Promise<Array<object>>} Generation results
	 */
	async generateLegacyMode(platforms, inputFile, outputDir, options) {
		if (platforms.length === 1) {
			const result = await this.generateForSinglePlatform(
				platforms[0],
				inputFile,
				outputDir,
				options
			);
			return [result];
		}

		return await this.generateForMultiplePlatforms(
			platforms,
			inputFile,
			outputDir,
			options
		);
	}

	/**
	 * Generate icons in adaptive mode (separate layers)
	 * @param {Array<string>} platforms - Platform names
	 * @param {object} adaptiveIcon - Adaptive icon configuration
	 * @param {string} outputDir - Output directory
	 * @param {object} options - Generation options
	 * @returns {Promise<Array<object>>} Generation results
	 */
	async generateAdaptiveMode(platforms, adaptiveIcon, outputDir, options) {
		const results = [];

		// For single platform
		if (platforms.length === 1) {
			const platform = platforms[0];

			if (platform === Platform.IOS) {
				// iOS: Create composite from layers
				const compositePath = await this.createIosCompositeFromLayers(
					adaptiveIcon.foreground,
					adaptiveIcon.background,
					outputDir
				);

				const result = await this.generateForSinglePlatform(
					Platform.IOS,
					compositePath,
					outputDir,
					{ force: true, zip: true }
				);

				// Clean up temporary composite
				await this.cleanupFile(compositePath);

				results.push(result);
			} else {
				// Android: Use native adaptive icons
				const result = await this.generateForSinglePlatform(
					platform,
					null,
					outputDir,
					options
				);
				results.push(result);
			}

			return results;
		}

		// For multiple platforms (iOS + Android)
		// iOS: Create composite from layers
		const compositePath = await this.createIosCompositeFromLayers(
			adaptiveIcon.foreground,
			adaptiveIcon.background,
			outputDir
		);

		const iosResult = await this.generateForSinglePlatform(
			Platform.IOS,
			compositePath,
			outputDir,
			{ force: true, zip: true }
		);
		results.push(iosResult);

		// Android: Use native adaptive icons
		const androidResult = await this.generateForSinglePlatform(
			Platform.ANDROID,
			null,
			outputDir,
			options
		);
		results.push(androidResult);

		// Clean up temporary composite
		await this.cleanupFile(compositePath);

		return results;
	}

	/**
	 * Main generation entry point
	 * @param {Array<string>} platforms - Platform names
	 * @param {object} modeInfo - Mode information
	 * @param {string} inputFile - Input file path (null for adaptive)
	 * @param {object} adaptiveIcon - Adaptive icon config (null for legacy)
	 * @param {string} outputDir - Output directory
	 * @param {object} options - Generation options
	 * @returns {Promise<Array<object>>} Generation results
	 */
	async generate(
		platforms,
		modeInfo,
		inputFile,
		adaptiveIcon,
		outputDir,
		options
	) {
		if (modeInfo.adaptiveMode) {
			return await this.generateAdaptiveMode(
				platforms,
				adaptiveIcon,
				outputDir,
				options
			);
		}

		return await this.generateLegacyMode(
			platforms,
			inputFile,
			outputDir,
			options
		);
	}

	/**
	 * Clean up a single file (ignore errors)
	 * @param {string} filePath - File to delete
	 * @returns {Promise<void>}
	 */
	async cleanupFile(filePath) {
		try {
			await fs.unlink(filePath);
		} catch (error) {
			// Ignore cleanup errors
		}
	}

	/**
	 * Clean up multiple files
	 * @param {Array<string>} filePaths - Files to delete
	 * @returns {Promise<void>}
	 */
	async cleanupFiles(filePaths) {
		for (const filePath of filePaths) {
			await this.cleanupFile(filePath);
		}
	}

	/**
	 * Clean up temporary directory
	 * @param {string} dirPath - Directory to remove
	 * @returns {Promise<void>}
	 */
	async cleanupDirectory(dirPath) {
		try {
			await fs.rm(dirPath, { recursive: true });
		} catch (error) {
			console.error("Failed to clean up temp directory:", error);
		}
	}
}
