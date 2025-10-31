/**
 * ImageProcessor - Single Responsibility: Handle all image processing operations
 * Abstracts the Sharp library and provides image manipulation methods
 */

import sharp from "sharp";

export class ImageProcessor {
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
	 * @returns {Promise<sharp.Sharp>} Composite image
	 */
	async createCompositeFromLayers(foregroundPath, backgroundPath, size = 1024) {
		// Prepare background layer (fills entire space)
		const bgLayer = await this.prepareAdaptiveLayer(
			backgroundPath || null, // null defaults to #111111
			size,
			false // isBackground - fills entire space
		);

		// Prepare foreground layer (with padding - centered and zoomed out)
		const fgLayer = await this.prepareAdaptiveLayer(
			foregroundPath,
			size,
			true // isForeground - adds padding
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
	 * @returns {Promise<sharp.Sharp>} Prepared layer image
	 */
	async prepareAdaptiveLayer(layerPath, targetSize, isForeground = false) {
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
		// Android adaptive icons specification:
		// - Total canvas: 108dp × 108dp
		// - Safe zone (logo area): 66dp × 66dp (center)
		// - Outer margin: 18dp on each side (36dp total)
		// - Safe zone = 66/108 = 0.6111 (61.11% content)
		// - Padding = 36/108 = 0.3333 (33.33% padding, 16.67% on each side)
		// This ensures important content isn't clipped by circular/squircle launcher masks
		if (isForeground) {
			// Calculate the safe zone size (66dp out of 108dp)
			const safeZoneRatio = 66 / 108; // 0.6111
			const safeZoneSize = Math.round(targetSize * safeZoneRatio);

			// Calculate padding needed (18dp on each side)
			const padding = Math.round((targetSize - safeZoneSize) / 2);

			// Resize image to fit within the 66dp safe zone, then extend to 108dp with transparent padding
			return image
				.clone()
				.resize(safeZoneSize, safeZoneSize, {
					kernel: sharp.kernel.lanczos3,
					fit: "contain", // Keep aspect ratio, fit within safe zone
					background: { r: 0, g: 0, b: 0, alpha: 0 },
					position: "centre",
				})
				.extend({
					top: padding,
					bottom: padding,
					left: padding,
					right: padding,
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				});
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
