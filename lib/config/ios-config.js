/**
 * iOS Platform Configuration
 * Defines all iOS-specific icon sizes and metadata
 */

/**
 * iOS icon size definitions
 * Each entry: { size: "WxH", scale: "Nx", filename: "..." }
 * Actual pixel dimension = parseFloat(size.split('x')[0]) * parseInt(scale)
 */
export const IOS_ICON_SIZES = [
	{ size: "20x20", scale: "2x", filename: "Icon-App-20x20@2x.png" },
	{ size: "20x20", scale: "3x", filename: "Icon-App-20x20@3x.png" },
	{ size: "29x29", scale: "2x", filename: "Icon-App-29x29@2x.png" },
	{ size: "29x29", scale: "3x", filename: "Icon-App-29x29@3x.png" },
	{ size: "38x38", scale: "2x", filename: "Icon-App-38x38@2x.png" },
	{ size: "38x38", scale: "3x", filename: "Icon-App-38x38@3x.png" },
	{ size: "40x40", scale: "2x", filename: "Icon-App-40x40@2x.png" },
	{ size: "40x40", scale: "3x", filename: "Icon-App-40x40@3x.png" },
	{ size: "60x60", scale: "2x", filename: "Icon-App-60x60@2x.png" },
	{ size: "60x60", scale: "3x", filename: "Icon-App-60x60@3x.png" },
	{ size: "64x64", scale: "2x", filename: "Icon-App-64x64@2x.png" },
	{ size: "64x64", scale: "3x", filename: "Icon-App-64x64@3x.png" },
	{ size: "68x68", scale: "2x", filename: "Icon-App-68x68@2x.png" },
	{ size: "76x76", scale: "2x", filename: "Icon-App-76x76@2x.png" },
	{ size: "83.5x83.5", scale: "2x", filename: "Icon-App-83.5x83.5@2x.png" },
	{ size: "1024x1024", scale: "1x", filename: "Icon-App-1024x1024@1x.png" },
	{ size: "1024x1024", scale: "2x", filename: "Icon-App-1024x1024@2x.png" },
	{ size: "167x167", scale: "2x", filename: "Icon-App-167x167@2x.png" },
	{ size: "152x152", scale: "2x", filename: "Icon-App-152x152@2x.png" },
];

/**
 * iOS icon size information for display
 */
export const IOS_SIZE_INFO = [
	{ size: "20×20", scale: "@2x/@3x", pixels: "40/60", use: "Notification" },
	{ size: "29×29", scale: "@2x/@3x", pixels: "58/87", use: "Settings" },
	{
		size: "38×38",
		scale: "@2x/@3x",
		pixels: "76/114",
		use: "Watch Companion",
	},
	{ size: "40×40", scale: "@2x/@3x", pixels: "80/120", use: "Spotlight" },
	{ size: "60×60", scale: "@2x/@3x", pixels: "120/180", use: "iPhone App" },
	{
		size: "64×64",
		scale: "@2x/@3x",
		pixels: "128/192",
		use: "Watch Notification",
	},
	{ size: "68×68", scale: "@2x", pixels: "136", use: "Watch App" },
	{ size: "76×76", scale: "@2x", pixels: "152", use: "iPad App" },
	{ size: "83.5×83.5", scale: "@2x", pixels: "167", use: "iPad Pro" },
	{ size: "152×152", scale: "@2x", pixels: "304", use: "iPad Pro" },
	{ size: "167×167", scale: "@2x", pixels: "334", use: "iPad Pro" },
	{ size: "1024×1024", scale: "@1x", pixels: "1024", use: "App Store" },
];

/**
 * iOS platform configuration
 */
export const IOS_CONFIG = {
	platformName: "iOS",
	platformKey: "ios",
	outputDirectoryName: "AppIcon.appiconset",
	metadataFileName: "Contents.json",
	minSourceImageSize: 1024,
	archiveName: "AppIcon.zip",
	iconSizes: IOS_ICON_SIZES,
	sizeInfo: IOS_SIZE_INFO,
};
