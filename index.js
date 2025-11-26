/**
 * Ino Icon Maker - Library Entry Point
 *
 * Generate iOS and Android app icons from a single image
 * Supports: JPEG, JPG, PNG, WebP
 *
 * @module ino-icon-maker
 * @version 1.0.4
 */

import { Platform } from "./lib/core/ImageProcessor.js";

// Import main generator functions for re-export
import {
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
};

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
export {
	SizeConfigManager,
	sizeConfigManager,
} from "./lib/core/SizeConfigManager.js";

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
 * @param {string} options.foreground - Path to foreground/icon image (required, same as CLI -fg)
 * @param {string} options.output - Output directory (required)
 * @param {string} [options.background] - Background layer: image path or hex color like '#FF5722' (optional, defaults to '#111111')
 * @param {string} [options.monochrome] - Path to monochrome layer image (optional, same as CLI -m)
 * @param {string} [options.platform=Platform.All] - Platform: 'ios', 'android', or 'all'
 * @param {boolean} [options.zip=false] - Create ZIP archive
 * @param {boolean} [options.force=false] - Overwrite existing files
 * @param {Object} [options.customSizes] - Custom size configuration
 * @param {Object} [options.customSizes.ios] - iOS-specific customization (addSizes, excludeSizes)
 * @param {Object} [options.customSizes.android] - Android-specific customization (addSizes, excludeSizes)
 * @param {number} [options.fgScale] - Scale foreground content for all platforms (e.g., 2.0 = zoom in 2x)
 * @param {number} [options.fgScaleIos] - Scale foreground content for iOS only
 * @param {number} [options.fgScaleAndroid] - Scale foreground content for Android only
 * @returns {Promise<Object|Array>} Generation result(s)
 *
 * @example
 * import { quickGenerate } from 'ino-icon-maker';
 *
 * // Basic usage - icon with dark background (same as CLI: ino-icon generate -fg icon.png)
 * await quickGenerate({
 *   foreground: './icon.png',
 *   output: './output'
 * });
 *
 * @example
 * // Icon with custom color background
 * await quickGenerate({
 *   foreground: './icon.png',
 *   background: '#FF5722',
 *   output: './output',
 *   zip: true
 * });
 *
 * @example
 * // Icon with background image
 * await quickGenerate({
 *   foreground: './foreground.png',
 *   background: './background.png',
 *   output: './output'
 * });
 *
 * @example
 * // All three layers (foreground, background, monochrome)
 * await quickGenerate({
 *   foreground: './foreground.png',
 *   background: './background.png',
 *   monochrome: './monochrome.png',
 *   output: './output'
 * });
 *
 * @example
 * // With foreground content scaling (zoom in/out)
 * await quickGenerate({
 *   foreground: './icon.png',
 *   output: './output',
 *   fgScale: 1.5  // Zoom in 1.5x (for images with too much padding)
 * });
 *
 * @example
 * // Platform-specific generation
 * await quickGenerate({
 *   foreground: './icon.png',
 *   output: './output',
 *   platform: 'ios'  // Generate iOS icons only
 * });
 *
 * @example
 * // With custom sizes (exclude or add specific sizes)
 * await quickGenerate({
 *   foreground: './icon.png',
 *   output: './output',
 *   customSizes: {
 *     android: {
 *       excludeSizes: ['ldpi', 'monochrome']  // Skip low-density and monochrome
 *     }
 *   }
 * });
 */
export async function quickGenerate(options) {
	const {
		output,
		platform = Platform.All,
		zip = false,
		force = false,
		customSizes,
		fgScale,
		fgScaleIos,
		fgScaleAndroid,
		// CLI-style parameters (same as CLI)
		foreground,
		background,
		monochrome,
	} = options;

	// Validate required parameters
	if (!foreground) {
		throw new Error(
			"'foreground' parameter is required (path to your icon image)"
		);
	}

	if (!output) {
		throw new Error("'output' parameter is required (output directory path)");
	}

	// Build adaptiveIcon configuration
	const finalAdaptiveIcon = {
		foreground,
		background: background || null, // null defaults to #111111
		monochrome,
	};

	const {
		generateIconsForPlatform,
		generateIconsForMultiplePlatforms,
		getSupportedPlatforms,
	} = await import("./lib/generator.js");

	const platforms =
		platform === Platform.All
			? getSupportedPlatforms()
			: [platform.toLowerCase()];

	// Build generation options
	const genOptions = {
		force,
		zip,
	};

	// Add adaptive icon configuration if provided
	if (finalAdaptiveIcon) {
		genOptions.adaptiveIcon = finalAdaptiveIcon;
	}

	// Add custom sizes if provided
	if (customSizes) {
		genOptions.customSizes = customSizes;
	}

	// Add foreground scale options if provided
	if (fgScale !== undefined) {
		genOptions.fgScale = fgScale;
	}
	if (fgScaleIos !== undefined) {
		genOptions.fgScaleIos = fgScaleIos;
	}
	if (fgScaleAndroid !== undefined) {
		genOptions.fgScaleAndroid = fgScaleAndroid;
	}

	if (platforms.length === 1) {
		// Single platform generation
		return await generateIconsForPlatform(
			platforms[0],
			null, // Always use adaptiveIcon mode
			output,
			genOptions
		);
	} else {
		// Multiple platforms - generate each separately
		const iosResult = await generateIconsForPlatform(
			Platform.IOS,
			null, // Always use adaptiveIcon mode
			output,
			genOptions
		);

		const androidResult = await generateIconsForPlatform(
			Platform.ANDROID,
			null, // Always use adaptiveIcon mode
			output,
			genOptions
		);

		return [iosResult, androidResult];
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
