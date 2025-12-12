/**
 * iOS Platform Configuration
 * Defines all iOS-specific icon sizes and metadata
 */

import { Platform } from "../core/ImageProcessor.js";

/**
 * iOS icon size definitions
 * Each entry: { size: "WxH", scale: "Nx", filename: "...", idiom: "..." }
 * Actual pixel dimension = parseFloat(size.split('x')[0]) * parseInt(scale)
 */
export const IOS_ICON_SIZES = [
	// iPhone icons
	{ size: "20x20", scale: "2x", filename: "Icon-App-20x20@2x.png", idiom: "iphone" },
	{ size: "20x20", scale: "3x", filename: "Icon-App-20x20@3x.png", idiom: "iphone" },
	{ size: "29x29", scale: "2x", filename: "Icon-App-29x29@2x.png", idiom: "iphone" },
	{ size: "29x29", scale: "3x", filename: "Icon-App-29x29@3x.png", idiom: "iphone" },
	{ size: "40x40", scale: "2x", filename: "Icon-App-40x40@2x.png", idiom: "iphone" },
	{ size: "40x40", scale: "3x", filename: "Icon-App-40x40@3x.png", idiom: "iphone" },
	{ size: "60x60", scale: "2x", filename: "Icon-App-60x60@2x.png", idiom: "iphone" },
	{ size: "60x60", scale: "3x", filename: "Icon-App-60x60@3x.png", idiom: "iphone" },
	// iPad icons
	{ size: "20x20", scale: "2x", filename: "Icon-App-20x20@2x.png", idiom: "ipad" },
	{ size: "29x29", scale: "2x", filename: "Icon-App-29x29@2x.png", idiom: "ipad" },
	{ size: "40x40", scale: "2x", filename: "Icon-App-40x40@2x.png", idiom: "ipad" },
	{ size: "76x76", scale: "2x", filename: "Icon-App-76x76@2x.png", idiom: "ipad" },
	{ size: "83.5x83.5", scale: "2x", filename: "Icon-App-83.5x83.5@2x.png", idiom: "ipad" },
	// App Store
	{ size: "1024x1024", scale: "1x", filename: "Icon-App-1024x1024@1x.png", idiom: "ios-marketing" },
];

/**
 * iOS icon size information for display
 */
export const IOS_SIZE_INFO = [
	{ size: "20×20", scale: "@2x/@3x", pixels: "40/60", use: "Notification" },
	{ size: "29×29", scale: "@2x/@3x", pixels: "58/87", use: "Settings" },
	{ size: "40×40", scale: "@2x/@3x", pixels: "80/120", use: "Spotlight" },
	{ size: "60×60", scale: "@2x/@3x", pixels: "120/180", use: "iPhone App" },
	{ size: "76×76", scale: "@2x", pixels: "152", use: "iPad App" },
	{ size: "83.5×83.5", scale: "@2x", pixels: "167", use: "iPad Pro" },
	{ size: "1024×1024", scale: "@1x", pixels: "1024", use: "App Store" },
];

/**
 * iOS platform configuration
 */
export const IOS_CONFIG = {
	platformName: "iOS",
	platformKey: Platform.IOS,
	outputDirectoryName: "AppIcon.appiconset",
	metadataFileName: "Contents.json",
	minSourceImageSize: 1024,
	archiveName: "AppIcon.zip",
	iconSizes: IOS_ICON_SIZES,
	sizeInfo: IOS_SIZE_INFO,
};
