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
 * @param {string} [options.input] - Path to source image (JPEG, PNG, WebP) - for legacy mode or iOS
 * @param {string} options.output - Output directory
 * @param {string} [options.platform='all'] - Platform: 'ios', 'android', or 'all'
 * @param {boolean} [options.zip=false] - Create ZIP archive
 * @param {boolean} [options.force=false] - Overwrite existing files
 * @param {Object} [options.adaptiveIcon] - Adaptive icon configuration (Android only)
 * @param {string} options.adaptiveIcon.foreground - Path to foreground layer image
 * @param {string} options.adaptiveIcon.background - Path to background layer image or hex color (e.g., '#FF5722')
 * @param {string} [options.adaptiveIcon.monochrome] - Path to monochrome layer image (optional)
 * @returns {Promise<Object|Array>} Generation result(s)
 *
 * @example
 * import { quickGenerate } from 'ino-icon-maker';
 *
 * // Generate for both platforms (legacy mode)
 * await quickGenerate({
 *   input: './my-icon.png',
 *   output: './output',
 *   zip: true
 * });
 *
 * @example
 * // Generate Android adaptive icons
 * await quickGenerate({
 *   output: './output',
 *   platform: 'android',
 *   adaptiveIcon: {
 *     foreground: './foreground.png',
 *     background: '#FF5722',
 *     monochrome: './monochrome.png'
 *   }
 * });
 *
 * @example
 * // Generate iOS + Android adaptive icons
 * await quickGenerate({
 *   input: './icon.png', // Used for iOS
 *   output: './output',
 *   platform: 'all',
 *   adaptiveIcon: {
 *     foreground: './fg.png',
 *     background: './bg.png'
 *   }
 * });
 */
export async function quickGenerate(options) {
	const {
		input,
		output,
		platform = "all",
		zip = false,
		force = false,
		adaptiveIcon,
	} = options;

	// Validate that either input OR adaptiveIcon is provided
	if (!input && !adaptiveIcon) {
		throw new Error(
			"Either 'input' or 'adaptiveIcon' configuration is required"
		);
	}

	if (!output) {
		throw new Error("Output path is required");
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

	// Build generation options
	const genOptions = {
		force,
		zip,
	};

	// Add adaptive icon configuration if provided
	if (adaptiveIcon) {
		genOptions.adaptiveIcon = adaptiveIcon;
	}

	if (platforms.length === 1) {
		return await generateIconsForPlatform(
			platforms[0],
			input,
			output,
			genOptions
		);
	} else {
		// Handle mixed mode (iOS + Android with adaptive)
		if (adaptiveIcon) {
			// Generate iOS with standard input
			const iosResult = input
				? await generateIconsForPlatform("ios", input, output, {
						force,
						zip,
				  })
				: null;
			// Generate Android with adaptive icons
			const androidResult = await generateIconsForPlatform(
				"android",
				input,
				output,
				genOptions
			);
			return iosResult ? [iosResult, androidResult] : [androidResult];
		} else {
			return await generateIconsForMultiplePlatforms(
				platforms,
				input,
				output,
				genOptions
			);
		}
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
