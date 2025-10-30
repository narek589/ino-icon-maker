/**
 * Ino Icon Maker - Library Entry Point
 *
 * Generate iOS and Android app icons from a single image
 * Supports: JPEG, JPG, PNG, WebP
 *
 * @module ino-icon-maker
 * @version 1.0.4
 */

// Export main generator functions
export {
	generateIcons,
	generateIconsForPlatform,
	generateIconsForMultiplePlatforms,
	validateImageFile,
	createZipArchive,
	getSupportedPlatforms,
	getPlatformInfo,
	getAllPlatformsInfo,
	iconGeneratorFactory,
} from "./lib/generator.js";

// Export platform-specific configurations
export {
	IOS_CONFIG,
	IOS_ICON_SIZES,
	IOS_SIZE_INFO,
} from "./lib/config/ios-config.js";
export {
	ANDROID_CONFIG,
	ANDROID_ICON_SIZES,
	ANDROID_SIZE_INFO,
} from "./lib/config/android-config.js";

// Export core classes for advanced usage
export { ImageProcessor } from "./lib/core/ImageProcessor.js";
export { FileManager } from "./lib/core/FileManager.js";
export { ArchiveManager } from "./lib/core/ArchiveManager.js";

// Export platform generators for advanced usage
export { IOSGenerator } from "./lib/platforms/IOSGenerator.js";
export { AndroidGenerator } from "./lib/platforms/AndroidGenerator.js";
export { PlatformGenerator } from "./lib/platforms/PlatformGenerator.js";

// Export factory
export { IconGeneratorFactory } from "./lib/IconGeneratorFactory.js";

/**
 * Quick start function - Generate icons with minimal configuration
 *
 * @param {Object} options - Generation options
 * @param {string} options.input - Path to source image (JPEG, PNG, WebP)
 * @param {string} options.output - Output directory
 * @param {string} [options.platform='all'] - Platform: 'ios', 'android', or 'all'
 * @param {boolean} [options.zip=false] - Create ZIP archive
 * @param {boolean} [options.force=false] - Overwrite existing files
 * @returns {Promise<Object|Array>} Generation result(s)
 *
 * @example
 * import { quickGenerate } from 'ino-icon-maker';
 *
 * // Generate for both platforms (default)
 * await quickGenerate({
 *   input: './my-icon.png',
 *   output: './output',
 *   zip: true
 * });
 *
 * @example
 * // Generate for iOS only
 * await quickGenerate({
 *   input: './my-icon.jpg',
 *   output: './output',
 *   platform: 'ios'
 * });
 */
export async function quickGenerate(options) {
	const {
		input,
		output,
		platform = "all",
		zip = false,
		force = false,
	} = options;

	if (!input || !output) {
		throw new Error("Input and output paths are required");
	}

	const {
		generateIconsForPlatform,
		generateIconsForMultiplePlatforms,
		getSupportedPlatforms,
	} = await import("./lib/generator.js");

	const platforms =
		platform.toLowerCase() === "all"
			? getSupportedPlatforms()
			: [platform.toLowerCase()];

	if (platforms.length === 1) {
		return await generateIconsForPlatform(platforms[0], input, output, {
			force,
			zip,
		});
	} else {
		return await generateIconsForMultiplePlatforms(platforms, input, output, {
			force,
			zip,
		});
	}
}

// Default export for convenience
export default {
	quickGenerate,
	generateIcons,
	generateIconsForPlatform,
	generateIconsForMultiplePlatforms,
	validateImageFile,
	createZipArchive,
	getSupportedPlatforms,
	getPlatformInfo,
	getAllPlatformsInfo,
};
