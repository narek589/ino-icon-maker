/**
 * Android Platform Configuration
 * Defines all Android-specific icon sizes and metadata
 */

import { Platform } from "../core/ImageProcessor";

/**
 * Android icon size definitions
 * Android uses density-based naming: ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi
 */
export const ANDROID_ICON_SIZES = [
	// Launcher icons (legacy)
	{
		density: "ldpi",
		size: 36,
		folder: "mipmap-ldpi",
		filename: "ic_launcher.png",
	},
	{
		density: "mdpi",
		size: 48,
		folder: "mipmap-mdpi",
		filename: "ic_launcher.png",
	},
	{
		density: "hdpi",
		size: 72,
		folder: "mipmap-hdpi",
		filename: "ic_launcher.png",
	},
	{
		density: "xhdpi",
		size: 96,
		folder: "mipmap-xhdpi",
		filename: "ic_launcher.png",
	},
	{
		density: "xxhdpi",
		size: 144,
		folder: "mipmap-xxhdpi",
		filename: "ic_launcher.png",
	},
	{
		density: "xxxhdpi",
		size: 192,
		folder: "mipmap-xxxhdpi",
		filename: "ic_launcher.png",
	},

	// Launcher round icons (Android 7.1+)
	{
		density: "ldpi",
		size: 36,
		folder: "mipmap-ldpi",
		filename: "ic_launcher_round.png",
	},
	{
		density: "mdpi",
		size: 48,
		folder: "mipmap-mdpi",
		filename: "ic_launcher_round.png",
	},
	{
		density: "hdpi",
		size: 72,
		folder: "mipmap-hdpi",
		filename: "ic_launcher_round.png",
	},
	{
		density: "xhdpi",
		size: 96,
		folder: "mipmap-xhdpi",
		filename: "ic_launcher_round.png",
	},
	{
		density: "xxhdpi",
		size: 144,
		folder: "mipmap-xxhdpi",
		filename: "ic_launcher_round.png",
	},
	{
		density: "xxxhdpi",
		size: 192,
		folder: "mipmap-xxxhdpi",
		filename: "ic_launcher_round.png",
	},

	// Play Store icon
	{
		density: "playstore",
		size: 512,
		folder: "playstore",
		filename: "ic_launcher_playstore.png",
	},
];

/**
 * Adaptive icon layer sizes (Android 8.0+, API 26+)
 * 108x108dp @ each density for foreground, background, and monochrome layers
 * 66x66dp safe zone in the center
 */
export const ANDROID_ADAPTIVE_ICON_SIZES = [
	{
		density: "ldpi",
		size: 81, // 108dp @ 0.75x
		folder: "mipmap-ldpi",
	},
	{
		density: "mdpi",
		size: 108, // 108dp @ 1x
		folder: "mipmap-mdpi",
	},
	{
		density: "hdpi",
		size: 162, // 108dp @ 1.5x
		folder: "mipmap-hdpi",
	},
	{
		density: "xhdpi",
		size: 216, // 108dp @ 2x
		folder: "mipmap-xhdpi",
	},
	{
		density: "xxhdpi",
		size: 324, // 108dp @ 3x
		folder: "mipmap-xxhdpi",
	},
	{
		density: "xxxhdpi",
		size: 432, // 108dp @ 4x
		folder: "mipmap-xxxhdpi",
	},
];

/**
 * Android icon size information for display
 */
export const ANDROID_SIZE_INFO = [
	{
		density: "ldpi",
		dpi: "120 dpi",
		size: "36×36",
		use: "Low density screens",
	},
	{
		density: "mdpi",
		dpi: "160 dpi",
		size: "48×48",
		use: "Medium density screens",
	},
	{
		density: "hdpi",
		dpi: "240 dpi",
		size: "72×72",
		use: "High density screens",
	},
	{
		density: "xhdpi",
		dpi: "320 dpi",
		size: "96×96",
		use: "Extra-high density",
	},
	{
		density: "xxhdpi",
		dpi: "480 dpi",
		size: "144×144",
		use: "Extra-extra-high density",
	},
	{
		density: "xxxhdpi",
		dpi: "640 dpi",
		size: "192×192",
		use: "Extra-extra-extra-high density",
	},
	{
		density: "Play Store",
		dpi: "-",
		size: "512×512",
		use: "Google Play Store",
	},
];

/**
 * Android platform configuration
 */
export const ANDROID_CONFIG = {
	platformName: "Android",
	platformKey: Platform.ANDROID,
	outputDirectoryName: "android-icons", // Directory name for Android icons
	metadataFileName: null, // Android doesn't use a metadata file like iOS
	minSourceImageSize: 512,
	archiveName: "AndroidIcons.zip",
	iconSizes: ANDROID_ICON_SIZES,
	adaptiveIconSizes: ANDROID_ADAPTIVE_ICON_SIZES,
	sizeInfo: ANDROID_SIZE_INFO,
};
