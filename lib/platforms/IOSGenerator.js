/**
 * IOSGenerator - iOS Platform Implementation
 *
 * Implements the PlatformGenerator interface for iOS icon generation
 * Follows Liskov Substitution Principle - can be used wherever PlatformGenerator is expected
 */

import path from "path";
import { PlatformGenerator } from "./PlatformGenerator.js";
import { IOS_CONFIG } from "../config/ios-config.js";

export class IOSGenerator extends PlatformGenerator {
	/**
	 * Create iOS generator with default dependencies
	 * @param {ImageProcessor} imageProcessor
	 * @param {FileManager} fileManager
	 * @param {ArchiveManager} archiveManager
	 */
	constructor(imageProcessor, fileManager, archiveManager) {
		super(IOS_CONFIG, imageProcessor, fileManager, archiveManager);
	}

	/**
	 * Generate all iOS icon sizes
	 * @param {sharp.Sharp} sourceImage - Prepared source image
	 * @param {string} outputDir - Output directory
	 */
	async generateIcons(sourceImage, outputDir) {
		// Generate all icons in parallel for better performance
		await Promise.all(
			this.config.iconSizes.map(iconDef =>
				this.generateSingleIcon(sourceImage, outputDir, iconDef)
			)
		);
	}

	/**
	 * Generate a single iOS icon
	 * @param {sharp.Sharp} sourceImage - Source image
	 * @param {string} outputDir - Output directory
	 * @param {object} iconDef - Icon definition {size, scale, filename}
	 */
	async generateSingleIcon(sourceImage, outputDir, iconDef) {
		const pixelSize = this.imageProcessor.calculatePixelSize(
			iconDef.size,
			iconDef.scale
		);
		const outputPath = path.join(outputDir, iconDef.filename);

		await this.imageProcessor.resizeAndSave(sourceImage, pixelSize, outputPath);

		console.log(`   ✓ ${iconDef.filename} (${pixelSize}x${pixelSize}px)`);
	}

	/**
	 * Generate iOS Contents.json metadata file
	 * @param {string} outputDir - Output directory
	 * @returns {Promise<string>} Path to metadata file
	 */
	async generateMetadata(outputDir) {
		const contentsJson = this.createContentsJson();
		const contentsPath = path.join(outputDir, this.config.metadataFileName);

		await this.fileManager.writeJson(contentsPath, contentsJson);
		console.log(`\n   ✓ ${this.config.metadataFileName}`);

		return contentsPath;
	}

	/**
	 * Create iOS Contents.json structure
	 * @returns {object} Contents.json object
	 */
	createContentsJson() {
		const images = this.config.iconSizes.map(icon => ({
			filename: icon.filename,
			idiom: "universal",
			platform: "ios",
			scale: icon.scale,
			size: icon.size,
		}));

		return {
			images,
			info: {
				author: "xcode",
				version: 1,
			},
		};
	}

	/**
	 * Validate iOS-specific requirements
	 * @param {string} inputPath - Path to input file
	 */
	async validateInput(inputPath) {
		await super.validateInput(inputPath);

		// iOS-specific validation could go here
		// For example, checking recommended dimensions, aspect ratio, etc.
	}
}
