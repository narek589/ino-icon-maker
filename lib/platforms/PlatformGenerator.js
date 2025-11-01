/**
 * PlatformGenerator - Abstract Base Class
 *
 * Implements:
 * - Dependency Inversion Principle: High-level modules depend on this abstraction
 * - Liskov Substitution Principle: All platform generators must be substitutable
 * - Template Method Pattern: Defines the algorithm structure
 *
 * All platform-specific generators must extend this class and implement required methods
 */

import path from "path";
import { ImageProcessor, Platform } from "../core/ImageProcessor.js";
import { FileManager } from "../core/FileManager.js";
import { ArchiveManager } from "../core/ArchiveManager.js";
import { sizeConfigManager } from "../core/SizeConfigManager.js";

export class PlatformGenerator {
	/**
	 * @param {object} config - Platform configuration
	 * @param {ImageProcessor} imageProcessor - Image processing service
	 * @param {FileManager} fileManager - File management service
	 * @param {ArchiveManager} archiveManager - Archive management service
	 * @param {object} [customSizes] - Optional size customization
	 */
	constructor(
		config,
		imageProcessor,
		fileManager,
		archiveManager,
		customSizes = null
	) {
		if (new.target === PlatformGenerator) {
			throw new Error(
				"PlatformGenerator is abstract and cannot be instantiated directly"
			);
		}

		// Store base config (never modified)
		this.baseConfig = config;

		// Apply size customization if provided
		this.config = customSizes
			? sizeConfigManager.applySizeCustomization(config, customSizes)
			: config;

		this.imageProcessor = imageProcessor;
		this.fileManager = fileManager;
		this.archiveManager = archiveManager;
		this.customSizes = customSizes;
	}

	/**
	 * Template method: Generate icons for platform
	 * This method defines the overall algorithm structure
	 *
	 * @param {string} inputPath - Path to source image
	 * @param {string} outputDir - Output directory
	 * @param {object} options - Generation options {force: boolean, zip: boolean, customSizes: object}
	 * @returns {Promise<object>} Generation result
	 */
	async generate(inputPath, outputDir, options = {}) {
		const { force = false, zip = false, customSizes = null, fgScale = null, fgScaleIos = null } = options;

		// Set foreground scale for iOS if provided
		// Platform-specific scale overrides global scale
		const iosScale = fgScaleIos || fgScale;
		if (iosScale !== null && iosScale !== undefined) {
			this.imageProcessor.setForegroundScale(Platform.IOS, parseFloat(iosScale));
		}

		// Apply custom sizes if provided in options (runtime customization)
		if (customSizes && !this.customSizes) {
			this.config = sizeConfigManager.applySizeCustomization(
				this.baseConfig,
				customSizes
			);
			this.customSizes = customSizes;
		}

		console.log(`\n🚀 ${this.config.platformName} Icon Generator\n`);
		console.log(`Input:  ${inputPath}`);
		console.log(`Output: ${outputDir}\n`);

		// Step 1: Validate input
		await this.validateInput(inputPath);

		// Step 2: Prepare output directory
		const targetDir = await this.prepareOutputDirectory(outputDir, force);

		// Step 3: Load and prepare source image
		const { image, metadata } = await this.imageProcessor.loadImage(inputPath);
		console.log(
			`📷 Loaded: ${metadata.width}x${metadata.height}, format: ${metadata.format}`
		);

		const preparedImage = await this.imageProcessor.prepareImage(
			image,
			metadata,
			this.config.minSourceImageSize
		);

		// Step 4: Generate icons (platform-specific)
		console.log(`\n📦 Generating ${this.config.platformName} icons...\n`);
		await this.generateIcons(preparedImage, targetDir);

		// Step 5: Generate metadata (platform-specific, optional)
		const metadataPath = await this.generateMetadata(targetDir);

		// Step 6: Create archive if requested
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
	 * Validate input image file
	 * @param {string} inputPath - Path to input file
	 */
	async validateInput(inputPath) {
		if (!this.fileManager.exists(inputPath)) {
			throw new Error(`Input file not found: ${inputPath}`);
		}

		const isValid = await this.imageProcessor.validateImageFormat(inputPath);
		if (!isValid) {
			throw new Error("Input file is not a valid image format");
		}
	}

	/**
	 * Prepare output directory
	 * @param {string} outputDir - Base output directory
	 * @param {boolean} force - Force overwrite
	 * @returns {Promise<string>} Full path to prepared directory
	 */
	async prepareOutputDirectory(outputDir, force) {
		return await this.fileManager.prepareOutputDirectory(
			outputDir,
			this.config.outputDirectoryName,
			force
		);
	}

	/**
	 * Create archive of generated icons
	 * @param {string} targetDir - Directory to archive
	 * @param {string} outputDir - Output directory for archive
	 * @returns {Promise<string>} Path to archive
	 */
	async createArchive(targetDir, outputDir) {
		const zipPath = path.join(outputDir, this.config.archiveName);
		return await this.archiveManager.createZipArchive(
			targetDir,
			zipPath,
			this.config.outputDirectoryName
		);
	}

	/**
	 * Get list of generated files
	 * @returns {Array<string>} List of filenames
	 */
	getGeneratedFiles() {
		const files = this.config.iconSizes.map(icon => icon.filename);
		if (this.config.metadataFileName) {
			files.push(this.config.metadataFileName);
		}
		return files;
	}

	/**
	 * Get platform information for display
	 * @returns {object} Platform info
	 */
	getPlatformInfo() {
		return {
			name: this.config.platformName,
			key: this.config.platformKey,
			iconCount: this.config.iconSizes.length,
			sizeInfo: this.config.sizeInfo,
		};
	}

	// ========================================================================
	// Abstract methods - Must be implemented by subclasses
	// ========================================================================

	/**
	 * Generate all icons for this platform
	 * @abstract
	 * @param {sharp.Sharp} sourceImage - Prepared source image
	 * @param {string} outputDir - Output directory
	 * @returns {Promise<void>}
	 */
	async generateIcons(sourceImage, outputDir) {
		throw new Error("generateIcons() must be implemented by subclass");
	}

	/**
	 * Generate platform-specific metadata file
	 * @abstract
	 * @param {string} outputDir - Output directory
	 * @returns {Promise<string|null>} Path to metadata file or null
	 */
	async generateMetadata(outputDir) {
		throw new Error("generateMetadata() must be implemented by subclass");
	}
}
