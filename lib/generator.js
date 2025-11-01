/**
 * Backward-compatible wrapper for the refactored icon generator
 *
 * This file maintains the existing API while using the new SOLID architecture internally
 * Ensures existing code continues to work without breaking changes
 */

import { iconGeneratorFactory } from "./IconGeneratorFactory.js";
import { Platform } from "./core/ImageProcessor.js";

/**
 * Generate iOS icons (backward-compatible function)
 * @param {string} inputPath - Path to source image
 * @param {string} outputDir - Output directory
 * @param {object} options - Generation options
 * @returns {Promise<object>} Generation result
 */
export async function generateIcons(inputPath, outputDir, options = {}) {
	const generator = iconGeneratorFactory.createGenerator(Platform.IOS);
	return await generator.generate(inputPath, outputDir, options);
}

/**
 * Generate icons for a specific platform
 * @param {string} platform - Platform name (Platform.IOS, Platform.ANDROID)
 * @param {string} inputPath - Path to source image
 * @param {string} outputDir - Output directory
 * @param {object} options - Generation options
 * @returns {Promise<object>} Generation result
 */
export async function generateIconsForPlatform(
	platform,
	inputPath,
	outputDir,
	options = {}
) {
	const generator = iconGeneratorFactory.createGenerator(platform);
	return await generator.generate(inputPath, outputDir, options);
}

/**
 * Generate icons for multiple platforms at once
 * @param {Array<string>} platforms - Array of platform names
 * @param {string} inputPath - Path to source image
 * @param {string} outputDir - Output directory
 * @param {object} options - Generation options
 * @returns {Promise<Array<object>>} Array of generation results
 */
export async function generateIconsForMultiplePlatforms(
	platforms,
	inputPath,
	outputDir,
	options = {}
) {
	const results = [];

	for (const platform of platforms) {
		try {
			const generator = iconGeneratorFactory.createGenerator(platform);
			const result = await generator.generate(inputPath, outputDir, options);
			results.push(result);
		} catch (error) {
			console.error(`Failed to generate ${platform} icons:`, error.message);
			results.push({
				success: false,
				platform,
				error: error.message,
			});
		}
	}

	return results;
}

/**
 * Validate image file (backward-compatible)
 * @param {string} filePath - Path to file
 * @returns {Promise<boolean>}
 */
export async function validateImageFile(filePath) {
	const generator = iconGeneratorFactory.createGenerator(Platform.IOS);
	return await generator.imageProcessor.validateImageFormat(filePath);
}

/**
 * Create ZIP archive (backward-compatible)
 * @param {string} sourceDir - Directory to archive
 * @param {string} outputPath - Output ZIP file path
 * @returns {Promise<string>}
 */
export async function createZipArchive(sourceDir, outputPath) {
	const generator = iconGeneratorFactory.createGenerator(Platform.IOS);
	return await generator.archiveManager.createZipArchive(
		sourceDir,
		outputPath,
		"AppIcon.appiconset"
	);
}

/**
 * Get supported platforms
 * @returns {Array<string>}
 */
export function getSupportedPlatforms() {
	return iconGeneratorFactory.getSupportedPlatforms();
}

/**
 * Get platform information
 * @param {string} platform - Platform name
 * @returns {object} Platform info
 */
export function getPlatformInfo(platform) {
	const generator = iconGeneratorFactory.createGenerator(platform);
	return generator.getPlatformInfo();
}

/**
 * Get all platforms information
 * @returns {Array<object>}
 */
export function getAllPlatformsInfo() {
	return iconGeneratorFactory.getAllPlatformInfo();
}

// Export factory for advanced usage
export { iconGeneratorFactory };
