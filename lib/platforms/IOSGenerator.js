/**
 * IOSGenerator - iOS Platform Implementation
 *
 * Implements the PlatformGenerator interface for iOS icon generation
 * Follows Liskov Substitution Principle - can be used wherever PlatformGenerator is expected
 */

import path from "path";
import { PlatformGenerator } from "./PlatformGenerator.js";
import { IOS_CONFIG } from "../config/ios-config.js";
import { Platform } from "../core/ImageProcessor.js";

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
	 * Override generate to support adaptive mode (layer-based)
	 * @param {string} inputPath - Path to source image (or null in adaptive mode)
	 * @param {string} outputDir - Output directory
	 * @param {object} options - Generation options
	 * @returns {Promise<object>} Generation result
	 */
	async generate(inputPath, outputDir, options = {}) {
		const { force = false, zip = false, adaptiveIcon } = options;

		// Check if using adaptive mode (layer-based generation)
		if (adaptiveIcon && adaptiveIcon.foreground) {
			return await this.generateAdaptiveMode(
				adaptiveIcon,
				outputDir,
				force,
				zip
			);
		}

		// Fall back to standard mode (single image)
		return await super.generate(inputPath, outputDir, options);
	}

	/**
	 * Generate icons in adaptive mode (with layers)
	 * Creates a composite from foreground + background layers
	 * @param {object} adaptiveIcon - Adaptive icon configuration
	 * @param {string} outputDir - Output directory
	 * @param {boolean} force - Force overwrite
	 * @param {boolean} zip - Create ZIP archive
	 * @returns {Promise<object>} Generation result
	 */
	async generateAdaptiveMode(adaptiveIcon, outputDir, force, zip) {
		console.log(
			`\n🚀 ${this.config.platformName} Icon Generator (Layer-Based Mode)\n`
		);
		console.log(`Foreground: ${adaptiveIcon.foreground}`);
		console.log(
			`Background: ${adaptiveIcon.background || "#111111 (default)"}`
		);
		console.log(`Output:     ${outputDir}\n`);

		// Create composite from layers
		console.log("🔨 Creating composite from layers...");
		const composite = await this.imageProcessor.createCompositeFromLayers(
			adaptiveIcon.foreground,
			adaptiveIcon.background || null, // null defaults to #111111
			1024, // 1024x1024 base size for iOS
			Platform.IOS // Use iOS platform for correct padding ratio
		);

		// Prepare output directory
		const targetDir = await this.prepareOutputDirectory(outputDir, force);

		// Generate icons from composite
		console.log(`\n📦 Generating ${this.config.platformName} icons...\n`);
		await this.generateIcons(composite, targetDir);

		// Generate metadata
		const metadataPath = await this.generateMetadata(targetDir);

		// Create archive if requested
		let zipPath = null;
		if (zip) {
			zipPath = await this.createArchive(targetDir, outputDir);
			console.log(`\n📦 Created ZIP: ${zipPath}`);
		}

		console.log(
			`\n✅ Successfully generated ${this.config.iconSizes.length} ${this.config.platformName} icons!\n`
		);

		return {
			success: true,
			platform: this.config.platformKey,
			outputDir: targetDir,
			files: this.getGeneratedFiles(),
			metadataPath,
			zipPath,
		};
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
			platform: Platform.IOS,
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
