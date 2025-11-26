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
 * @param {string} [options.input] - Path to source image (JPEG, PNG, WebP) - for single image mode
 * @param {string} options.output - Output directory
 * @param {string} [options.platform=Platform.All] - Platform: Platform.IOS, Platform.ANDROID, or Platform.All
 * @param {boolean} [options.zip=false] - Create ZIP archive
 * @param {boolean} [options.force=false] - Overwrite existing files
 * 
 * @param {string} [options.foreground] - Path to foreground layer image (CLI-style, same as CLI -fg)
 * @param {string} [options.background] - Path to background layer or hex color like '#FF5722' (CLI-style, same as CLI -bg)
 * @param {string} [options.monochrome] - Path to monochrome layer image (CLI-style, same as CLI -m)
 * 
 * @param {Object} [options.adaptiveIcon] - Adaptive icon configuration (alternative to foreground/background)
 * @param {string} options.adaptiveIcon.foreground - Path to foreground layer image
 * @param {string} options.adaptiveIcon.background - Path to background layer image or hex color (e.g., '#FF5722')
 * @param {string} [options.adaptiveIcon.monochrome] - Path to monochrome layer image (optional)
 * 
 * @param {Object} [options.customSizes] - Custom size configuration (optional)
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
 * // Simple mode - single image for both platforms
 * await quickGenerate({
 *   input: './my-icon.png',
 *   output: './output',
 *   zip: true
 * });
 *
 * @example
 * // CLI-style - foreground + background (works exactly like CLI)
 * await quickGenerate({
 *   foreground: './icon.png',
 *   background: '#FF5722',
 *   output: './output',
 *   fgScale: 1.2
 * });
 *
 * @example
 * // With all three layers
 * await quickGenerate({
 *   foreground: './foreground.png',
 *   background: './background.png',
 *   monochrome: './monochrome.png',
 *   output: './output'
 * });
 *
 * @example
 * // Alternative syntax using adaptiveIcon object
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
 * // Generate with custom sizes
 * await quickGenerate({
 *   input: './icon.png',
 *   output: './output',
 *   customSizes: {
 *     android: {
 *       excludeSizes: ['ldpi', 'monochrome']  // Skip low-density and monochrome
 *     }
 *   }
 * });
 *
 * @example
 * // Add custom icon size
 * await quickGenerate({
 *   input: './icon.png',
 *   output: './output',
 *   platform: 'ios',
 *   customSizes: {
 *     ios: {
 *       addSizes: [
 *         { size: "1024x1024", scale: "3x", filename: "Icon-App-1024x1024@3x.png" }
 *       ]
 *     }
 *   }
 * });
 */
export async function quickGenerate(options) {
	const {
		input,
		output,
		platform = Platform.All,
		zip = false,
		force = false,
		adaptiveIcon,
		customSizes,
		fgScale,
		fgScaleIos,
		fgScaleAndroid,
		// CLI-style parameters (same as CLI)
		foreground,
		background,
		monochrome,
	} = options;

	// Build adaptiveIcon from CLI-style parameters if provided
	let finalAdaptiveIcon = adaptiveIcon;
	if (foreground) {
		finalAdaptiveIcon = {
			foreground,
			background: background || null, // null defaults to #111111
			monochrome,
		};
	}

	// Validate that either input OR adaptiveIcon/foreground is provided
	if (!input && !finalAdaptiveIcon) {
		throw new Error(
			"Either 'input', 'foreground', or 'adaptiveIcon' configuration is required"
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
		return await generateIconsForPlatform(
			platforms[0],
			input,
			output,
			genOptions
		);
	} else {
		// Handle mixed mode (iOS + Android with adaptive)
		if (finalAdaptiveIcon) {
			// Generate iOS with standard input
			const iosResult = input
				? await generateIconsForPlatform(Platform.IOS, input, output, {
						force,
						zip,
				  })
				: null;
			// Generate Android with adaptive icons
			const androidResult = await generateIconsForPlatform(
				Platform.ANDROID,
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
