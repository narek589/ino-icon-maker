/**
 * ImageProcessor - Single Responsibility: Handle all image processing operations
 * Abstracts the Sharp library and provides image manipulation methods
 */

import sharp from "sharp";

// ============================================================================
// 🎯 PLATFORM ENUM
// ============================================================================
export const Platform = Object.freeze({
	IOS: "ios",
	ANDROID: "android",
	All: "all",
});

// ============================================================================
// 🎨 ICON PADDING CONFIGURATION
// ============================================================================
// Configure how much the foreground icon is "zoomed out" (padding/safe zone)
// Higher value = more content, less padding (zoomed in)
// Lower value = less content, more padding (zoomed out)
//
// Examples:
//   1.0  = 100% content, 0% padding  (fills entire space)
//   0.9  = 90% content, 10% padding (minimal zoom out)
//   0.8  = 80% content, 20% padding (comfortable)
//   0.61 = 54% content, 39% padding (Android standard safe zone)
//   0.5  = 50% content, 50% padding (maximum zoom out)
//
// Quick presets:
// No padding:     { [Platform.IOS]: 1.0,  [Platform.ANDROID]: 1.0  }
// Minimal:        { [Platform.IOS]: 0.95, [Platform.ANDROID]: 0.90 }
// Light:          { [Platform.IOS]: 0.90, [Platform.ANDROID]: 0.80 }
// Standard:       { [Platform.IOS]: 0.80, [Platform.ANDROID]: 0.6111 }
// Generous:       { [Platform.IOS]: 0.70, [Platform.ANDROID]: 0.50 }
//
const ICON_PADDING_CONFIG = {
	[Platform.IOS]: 0.8, // iOS foreground content ratio (75% = minimal padding)
	[Platform.ANDROID]: 0.54, // Android foreground content ratio (54% = standard safe zone)
};
// ============================================================================

export class ImageProcessor {
	constructor() {
		// Allow runtime override of padding config for fg-scale feature
		this.paddingConfig = { ...ICON_PADDING_CONFIG };
		this.fgScaleIOS = 1.0; // iOS foreground content scale factor
		this.fgScaleAndroid = 1.0; // Android foreground content scale factor
	}

	/**
	 * Set foreground scale factor for specific platform
	 * @param {string} platform - Platform (Platform.IOS or Platform.ANDROID)
	 * @param {number} scale - Scale factor (1.0 = normal, 2.0 = 2x larger content)
	 */
	setForegroundScale(platform, scale) {
		if (platform === Platform.IOS) {
			this.fgScaleIOS = scale;
		} else if (platform === Platform.ANDROID) {
			this.fgScaleAndroid = scale;
		}
	}

	/**
	 * Load and validate an image file
	 * @param {string} filePath - Path to image file
	 * @returns {Promise<{image: sharp.Sharp, metadata: object}>}
	 */
	async loadImage(filePath) {
		try {
			const image = sharp(filePath);
			const metadata = await image.metadata();

			if (!metadata.width || !metadata.height) {
				throw new Error("Invalid image file: unable to read dimensions");
			}

			return { image, metadata };
		} catch (error) {
			throw new Error(`Failed to load image: ${error.message}`);
		}
	}

	/**
	 * Validate if file is a supported image format
	 * Supports: JPEG, PNG, WebP, AVIF, TIFF
	 *
	 * @param {string} filePath - Path to file
	 * @returns {Promise<boolean>}
	 */
	async validateImageFormat(filePath) {
		try {
			const metadata = await sharp(filePath).metadata();

			// Supported image formats
			const supportedFormats = ["jpeg", "jpg", "png", "webp", "avif", "tiff"];

			return supportedFormats.includes(metadata.format);
		} catch (error) {
			return false;
		}
	}

	/**
	 * Get supported image formats
	 * @returns {Array<string>} List of supported formats
	 */
	getSupportedFormats() {
		return ["jpeg", "jpg", "png", "webp", "avif", "tiff"];
	}

	/**
	 * Prepare image for icon generation
	 * - Resizes if necessary to minimum size
	 * - Centers on transparent background if not square
	 * @param {sharp.Sharp} image - Source image
	 * @param {object} metadata - Image metadata
	 * @param {number} minSize - Minimum required size
	 * @returns {Promise<sharp.Sharp>}
	 */
	async prepareImage(image, metadata, minSize = 1024) {
		const maxDimension = Math.max(metadata.width, metadata.height);
		let processedImage = image;

		// Upscale if smaller than minimum size
		if (maxDimension < minSize) {
			const scaleFactor = minSize / maxDimension;
			const newWidth = Math.round(metadata.width * scaleFactor);
			const newHeight = Math.round(metadata.height * scaleFactor);

			console.log(
				`   ⚠️  Image is smaller than ${minSize}px, upscaling with Lanczos3...`
			);

			processedImage = processedImage.resize(newWidth, newHeight, {
				kernel: sharp.kernel.lanczos3,
				fit: "fill",
			});

			metadata.width = newWidth;
			metadata.height = newHeight;
		}

		// Center on square transparent canvas if not square
		if (metadata.width !== metadata.height) {
			console.log(
				`   📐 Non-square image detected, centering on transparent canvas...`
			);

			const targetSize = Math.max(metadata.width, metadata.height);
			processedImage = processedImage.resize(targetSize, targetSize, {
				fit: "contain",
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			});
		}

		return processedImage;
	}

	/**
	 * Resize image to specific dimensions and save
	 * @param {sharp.Sharp} sourceImage - Source image
	 * @param {number} size - Target size (square)
	 * @param {string} outputPath - Output file path
	 * @param {object} options - Sharp options
	 */
	async resizeAndSave(sourceImage, size, outputPath, options = {}) {
		const defaultOptions = {
			kernel: sharp.kernel.lanczos3,
			fit: "fill",
		};

		const pngOptions = {
			compressionLevel: 9,
			adaptiveFiltering: true,
		};

		await sourceImage
			.clone()
			.resize(size, size, { ...defaultOptions, ...options })
			.png(pngOptions)
			.toFile(outputPath);
	}

	/**
	 * Save image directly without resizing (for pre-processed images)
	 * @param {sharp.Sharp} sourceImage - Source image (already at correct size)
	 * @param {string} outputPath - Output file path
	 */
	async saveImage(sourceImage, outputPath) {
		const pngOptions = {
			compressionLevel: 9,
			adaptiveFiltering: true,
		};

		await sourceImage.clone().png(pngOptions).toFile(outputPath);
	}

	/**
	 * Calculate pixel size from point size and scale factor
	 * @param {string} sizeStr - Size string (e.g., "20x20" or "83.5x83.5")
	 * @param {string} scale - Scale string (e.g., "2x" or "3x")
	 * @returns {number}
	 */
	calculatePixelSize(sizeStr, scale) {
		const baseSize = parseFloat(sizeStr.split("x")[0]);
		const scaleFactor = parseInt(scale.replace("x", ""));
		return Math.round(baseSize * scaleFactor);
	}

	/**
	 * Create a circular mask SVG for round icons
	 * @param {number} size - Size of the circular mask
	 * @returns {Buffer} SVG buffer with circular mask
	 */
	createCircularMask(size) {
		const radius = size / 2;
		const svg = `
			<svg width="${size}" height="${size}">
				<circle cx="${radius}" cy="${radius}" r="${radius}" fill="white"/>
			</svg>
		`;
		return Buffer.from(svg);
	}

	/**
	 * Resize image to specific dimensions, apply circular mask, and save
	 * @param {sharp.Sharp} sourceImage - Source image
	 * @param {number} size - Target size (square)
	 * @param {string} outputPath - Output file path
	 * @param {object} options - Sharp options
	 */
	async resizeAndSaveRound(sourceImage, size, outputPath, options = {}) {
		const defaultOptions = {
			kernel: sharp.kernel.lanczos3,
			fit: "fill",
		};

		const pngOptions = {
			compressionLevel: 9,
			adaptiveFiltering: true,
		};

		// Create circular mask
		const mask = this.createCircularMask(size);

		// Resize and apply circular mask
		await sourceImage
			.clone()
			.resize(size, size, { ...defaultOptions, ...options })
			.composite([
				{
					input: mask,
					blend: "dest-in",
				},
			])
			.png(pngOptions)
			.toFile(outputPath);
	}

	/**
	 * Validate adaptive icon layers
	 * @param {string} foregroundPath - Path to foreground layer
	 * @param {string} backgroundPath - Path to background layer (image or hex color)
	 * @param {string} monochromePath - Optional path to monochrome layer
	 * @returns {Promise<{isValid: boolean, error?: string, layers: object}>}
	 */
	async validateAdaptiveLayers(foregroundPath, backgroundPath, monochromePath) {
		const result = {
			isValid: true,
			layers: {},
		};

		try {
			// Validate foreground layer
			if (!foregroundPath) {
				return {
					isValid: false,
					error: "Foreground layer is required for adaptive icons",
				};
			}

			const fgValid = await this.validateImageFormat(foregroundPath);
			if (!fgValid) {
				return {
					isValid: false,
					error: "Foreground layer is not a valid image format",
				};
			}

			const fgMetadata = await sharp(foregroundPath).metadata();
			result.layers.foreground = { path: foregroundPath, metadata: fgMetadata };

			// Validate background layer (can be image, hex color, or null for default #111111)
			if (!backgroundPath) {
				// Use default #111111 background
				result.layers.background = { color: "#111111", isDefault: true };
			} else if (this.isHexColor(backgroundPath)) {
				// Check if background is a hex color
				result.layers.background = { color: backgroundPath };
			} else {
				// Background is an image file
				const bgValid = await this.validateImageFormat(backgroundPath);
				if (!bgValid) {
					return {
						isValid: false,
						error: "Background layer is not a valid image or hex color",
					};
				}

				const bgMetadata = await sharp(backgroundPath).metadata();
				result.layers.background = {
					path: backgroundPath,
					metadata: bgMetadata,
				};
			}

			// Validate monochrome layer (optional)
			if (monochromePath) {
				const monoValid = await this.validateImageFormat(monochromePath);
				if (!monoValid) {
					return {
						isValid: false,
						error: "Monochrome layer is not a valid image format",
					};
				}

				const monoMetadata = await sharp(monochromePath).metadata();
				result.layers.monochrome = {
					path: monochromePath,
					metadata: monoMetadata,
				};
			}

			return result;
		} catch (error) {
			return {
				isValid: false,
				error: `Failed to validate adaptive layers: ${error.message}`,
			};
		}
	}

	/**
	 * Check if a string is a valid hex color
	 * @param {string} str - String to check
	 * @returns {boolean}
	 */
	isHexColor(str) {
		return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);
	}

	/**
	 * Create a solid color image
	 * @param {number} width - Image width
	 * @param {number} height - Image height
	 * @param {string} hexColor - Hex color (e.g., '#FF5722')
	 * @returns {sharp.Sharp} Sharp instance with solid color
	 */
	createSolidColorImage(width, height, hexColor) {
		// Parse hex color to RGB
		const hex = hexColor.replace("#", "");
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		// Create solid color image
		return sharp({
			create: {
				width,
				height,
				channels: 4,
				background: { r, g, b, alpha: 1 },
			},
		});
	}

	/**
	 * Create a composite image from background and foreground layers
	 * Used for iOS when generating from layer-based workflow
	 * @param {string} foregroundPath - Path to foreground image
	 * @param {string} backgroundPath - Path to background image or hex color (or null for #111111)
	 * @param {number} size - Target size for composite
	 * @param {string} platform - Platform (use Platform.IOS or Platform.ANDROID)
	 * @returns {Promise<sharp.Sharp>} Composite image
	 */
	async createCompositeFromLayers(
		foregroundPath,
		backgroundPath,
		size = 1024,
		platform = Platform.IOS
	) {
		// Prepare background layer (fills entire space)
		const bgLayer = await this.prepareAdaptiveLayer(
			backgroundPath || null, // null defaults to #111111
			size,
			false, // isBackground - fills entire space
			platform
		);

		// Prepare foreground layer (with platform-specific padding)
		const fgLayer = await this.prepareAdaptiveLayer(
			foregroundPath,
			size,
			true, // isForeground - adds padding
			platform // Pass platform for correct padding ratio
		);

		// Convert to buffers
		const bgBuffer = await bgLayer.png().toBuffer();
		const fgBuffer = await fgLayer.png().toBuffer();

		// Composite foreground over background
		const composite = await sharp(bgBuffer)
			.composite([
				{
					input: fgBuffer,
					blend: "over",
				},
			])
			.png()
			.toBuffer();

		return sharp(composite);
	}

	/**
	 * Prepare adaptive icon layer for generation
	 * @param {string} layerPath - Path to layer image or hex color (or null for default #111111)
	 * @param {number} targetSize - Target size in pixels
	 * @param {boolean} isForeground - If true, adds padding/safe zone (recommended for foreground layers)
	 * @param {string} platform - Platform (use Platform.IOS or Platform.ANDROID)
	 * @returns {Promise<sharp.Sharp>} Prepared layer image
	 */
	async prepareAdaptiveLayer(
		layerPath,
		targetSize,
		isForeground = false,
		platform = Platform.ANDROID
	) {
		// If no layer path provided, use default #111111 background
		if (!layerPath) {
			return this.createSolidColorImage(targetSize, targetSize, "#111111");
		}

		// If it's a hex color, create a solid color image
		if (this.isHexColor(layerPath)) {
			return this.createSolidColorImage(targetSize, targetSize, layerPath);
		}

		// Load and prepare the image
		const { image, metadata } = await this.loadImage(layerPath);

		// For foreground layers, add padding (safe zone) to prevent clipping by launcher masks
		// Uses platform-specific padding ratios from ICON_PADDING_CONFIG
		// Android adaptive icons specification:
		// - Total canvas: 108dp × 108dp
		// - Safe zone (logo area): 66dp × 66dp (center)
		// - Outer margin: 18dp on each side (36dp total)
		// - Safe zone = 66/108 = 0.6111 (61.11% content)
		// This ensures important content isn't clipped by circular/squircle launcher masks
		if (isForeground) {
			// Use platform-specific safe zone ratio from config
			let safeZoneRatio =
				this.paddingConfig[platform] || this.paddingConfig[Platform.ANDROID];

			// Apply foreground scale factor for the specific platform
			const fgScale =
				platform === Platform.IOS ? this.fgScaleIOS : this.fgScaleAndroid;

			// DIRECT SCALE FORMULA:
			// Multiply the content size by the scale factor
			// scale=1 → normal size with padding
			// scale=2 → 2x bigger content (may overflow and get cropped)
			// scale=0.5 → 0.5x smaller content (more padding)
			safeZoneRatio = safeZoneRatio * fgScale;

			// Clamp to reasonable range
			safeZoneRatio = Math.max(0.1, safeZoneRatio);

			const contentSize = Math.round(targetSize * safeZoneRatio);

			// If content fits within target (ratio <=1), add padding
			if (safeZoneRatio <= 1.0) {
				const totalPadding = targetSize - contentSize;
				const paddingTop = Math.floor(totalPadding / 2);
				const paddingBottom = totalPadding - paddingTop;

				return image
					.clone()
					.resize(contentSize, contentSize, {
						kernel: sharp.kernel.lanczos3,
						fit: "contain",
						background: { r: 0, g: 0, b: 0, alpha: 0 },
						position: "centre",
					})
					.extend({
						top: paddingTop,
						bottom: paddingBottom,
						left: paddingTop,
						right: paddingBottom,
						background: { r: 0, g: 0, b: 0, alpha: 0 },
					});
			} else {
				// Content is larger than target (zoom in / crop mode)
				// Resize to contentSize, then crop/extract the center targetSize portion
				return image
					.clone()
					.resize(contentSize, contentSize, {
						kernel: sharp.kernel.lanczos3,
						fit: "contain",
						background: { r: 0, g: 0, b: 0, alpha: 0 },
						position: "centre",
					})
					.extract({
						left: Math.round((contentSize - targetSize) / 2),
						top: Math.round((contentSize - targetSize) / 2),
						width: targetSize,
						height: targetSize,
					});
			}
		}

		// For background layers, use 'cover' to fill entire space
		// Using 'cover' fills the entire space while maintaining aspect ratio
		// This prevents transparent padding and ensures the background fills the entire canvas
		return image.clone().resize(targetSize, targetSize, {
			kernel: sharp.kernel.lanczos3, // High-quality resampling
			fit: "cover", // Fill entire space, crop edges if needed (no distortion)
			position: "centre", // Center the image
		});
	}
}
