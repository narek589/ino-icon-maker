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
	 * Supports ONLY: JPEG, JPG, PNG, WebP
	 *
	 * @param {string} filePath - Path to file
	 * @returns {Promise<boolean>}
	 */
	async validateImageFormat(filePath) {
		try {
			const metadata = await sharp(filePath).metadata();

			// Only these 4 formats are supported
			const supportedFormats = ["jpeg", "jpg", "png", "webp"];

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
		return ["jpeg", "jpg", "png", "webp"];
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
}
