/**
 * AndroidGenerator - Android Platform Implementation
 *
 * Implements the PlatformGenerator interface for Android icon generation
 * Follows Liskov Substitution Principle - can be used wherever PlatformGenerator is expected
 */

import path from "path";
import sharp from "sharp";
import { PlatformGenerator } from "./PlatformGenerator.js";
import { ANDROID_CONFIG } from "../config/android-config.js";
import { Platform } from "../core/ImageProcessor.js";

export class AndroidGenerator extends PlatformGenerator {
	/**
	 * Create Android generator with default dependencies
	 * @param {ImageProcessor} imageProcessor
	 * @param {FileManager} fileManager
	 * @param {ArchiveManager} archiveManager
	 * @param {object} [customSizes] - Optional size customization
	 */
	constructor(imageProcessor, fileManager, archiveManager, customSizes = null) {
		super(
			ANDROID_CONFIG,
			imageProcessor,
			fileManager,
			archiveManager,
			customSizes
		);
	}

	/**
	 * Detect if adaptive icon mode is enabled
	 * @param {object} options - Generation options
	 * @returns {boolean}
	 */
	detectAdaptiveMode(options) {
		return options && options.adaptiveIcon && options.adaptiveIcon.foreground;
	}

	/**
	 * Override generate method to support adaptive icons
	 * @param {string} inputPath - Path to source image
	 * @param {string} outputDir - Output directory
	 * @param {object} options - Generation options {force, zip, adaptiveIcon}
	 * @returns {Promise<object>} Generation result
	 */
	async generate(inputPath, outputDir, options = {}) {
		const { force = false, zip = false, adaptiveIcon } = options;

		// Check if using adaptive icon mode
		if (this.detectAdaptiveMode(options)) {
			return await this.generateAdaptiveMode(
				adaptiveIcon,
				outputDir,
				force,
				zip
			);
		}

		// Fall back to legacy mode (single image)
		return await super.generate(inputPath, outputDir, options);
	}

	/**
	 * Generate icons in adaptive mode (with separate layers)
	 * @param {object} adaptiveIcon - Adaptive icon configuration
	 * @param {string} outputDir - Output directory
	 * @param {boolean} force - Force overwrite
	 * @param {boolean} zip - Create ZIP archive
	 * @returns {Promise<object>} Generation result
	 */
	async generateAdaptiveMode(adaptiveIcon, outputDir, force, zip) {
		console.log(
			`\n🚀 ${this.config.platformName} Icon Generator (Adaptive Mode)\n`
		);
		console.log(`Foreground: ${adaptiveIcon.foreground}`);
		console.log(
			`Background: ${adaptiveIcon.background || "#111111 (default)"}`
		);
		if (adaptiveIcon.monochrome) {
			console.log(`Monochrome: ${adaptiveIcon.monochrome}`);
		}
		console.log(`Output:     ${outputDir}\n`);

		// Prepare output directory
		const targetDir = await this.prepareOutputDirectory(outputDir, force);

		// Create folder structure for all densities
		const folders = new Set([
			...this.config.iconSizes.map(icon => icon.folder),
			...this.config.adaptiveIconSizes.map(icon => icon.folder),
		]);
		await this.createFolderStructure(targetDir, folders);

		// Generate adaptive icon layers
		await this.generateAdaptiveIcons(adaptiveIcon, targetDir);

		// Generate legacy icons for compatibility
		await this.generateLegacyFromAdaptive(adaptiveIcon, targetDir);

		// Create archive if requested
		let zipPath = null;
		if (zip) {
			zipPath = await this.createArchive(targetDir, outputDir);
			console.log(`\n📦 Created ZIP: ${zipPath}`);
		}

		const totalIcons =
			this.config.adaptiveIconSizes.length * 3 + // 3 layers per density
			this.config.iconSizes.length + // legacy icons
			2; // XML files

		console.log(
			`\n✅ Successfully generated ${totalIcons} ${this.config.platformName} icons!\n`
		);

		return {
			success: true,
			platform: this.config.platformKey,
			outputDir: targetDir,
			files: this.getAdaptiveGeneratedFiles(),
			metadataPath: null,
			zipPath,
			adaptiveMode: true,
		};
	}

	/**
	 * Generate all Android icon sizes (legacy mode)
	 * @param {sharp.Sharp} sourceImage - Prepared source image
	 * @param {string} outputDir - Output directory
	 */
	async generateIcons(sourceImage, outputDir) {
		// Group icons by folder to create directory structure
		const iconsByFolder = this.groupIconsByFolder();

		// Create all necessary subdirectories
		await this.createFolderStructure(outputDir, iconsByFolder);

		// Generate all icons in parallel
		await Promise.all(
			this.config.iconSizes.map(iconDef =>
				this.generateSingleIcon(sourceImage, outputDir, iconDef)
			)
		);
	}

	/**
	 * Group icons by their target folders
	 * @returns {Set<string>} Set of folder names
	 */
	groupIconsByFolder() {
		return new Set(this.config.iconSizes.map(icon => icon.folder));
	}

	/**
	 * Create Android folder structure (mipmap-* directories)
	 * @param {string} outputDir - Base output directory
	 * @param {Set<string>} folders - Set of folder names
	 */
	async createFolderStructure(outputDir, folders) {
		const createPromises = Array.from(folders).map(folder =>
			this.fileManager.ensureDirectory(path.join(outputDir, folder))
		);
		await Promise.all(createPromises);
	}

	/**
	 * Generate a single Android icon
	 * @param {sharp.Sharp} sourceImage - Source image
	 * @param {string} outputDir - Output directory
	 * @param {object} iconDef - Icon definition {density, size, folder, filename}
	 */
	async generateSingleIcon(sourceImage, outputDir, iconDef) {
		const outputPath = path.join(outputDir, iconDef.folder, iconDef.filename);
		const size = iconDef.size;

		// Use circular mask for round launcher icons
		const isRoundIcon = iconDef.filename.includes("_round");

		if (isRoundIcon) {
			await this.imageProcessor.resizeAndSaveRound(
				sourceImage,
				size,
				outputPath
			);
			console.log(
				`   ✓ ${iconDef.folder}/${iconDef.filename} (${size}x${size}px, circular)`
			);
		} else {
			await this.imageProcessor.resizeAndSave(sourceImage, size, outputPath);
			console.log(
				`   ✓ ${iconDef.folder}/${iconDef.filename} (${size}x${size}px)`
			);
		}
	}

	/**
	 * Generate Android metadata
	 * Android doesn't use a central metadata file like iOS
	 * @param {string} outputDir - Output directory
	 * @returns {Promise<null>}
	 */
	async generateMetadata(outputDir) {
		// Android doesn't require a Contents.json equivalent
		// Icon resources are referenced directly in AndroidManifest.xml
		console.log(
			`\n   ℹ️  Android icons ready - reference in AndroidManifest.xml`
		);
		return null;
	}

	/**
	 * Get list of generated files for Android (legacy mode)
	 * @returns {Array<string>} List of file paths relative to output directory
	 */
	getGeneratedFiles() {
		return this.config.iconSizes.map(icon => `${icon.folder}/${icon.filename}`);
	}

	/**
	 * Get list of generated files for Android (adaptive mode)
	 * @returns {Array<string>} List of file paths relative to output directory
	 */
	getAdaptiveGeneratedFiles() {
		const files = [];

		// Adaptive icon layers
		for (const sizeConfig of this.config.adaptiveIconSizes) {
			files.push(`${sizeConfig.folder}/ic_launcher_foreground.png`);
			files.push(`${sizeConfig.folder}/ic_launcher_background.png`);
			files.push(`${sizeConfig.folder}/ic_launcher_monochrome.png`);
		}

		// Legacy icons
		files.push(...this.getGeneratedFiles());

		// XML files
		files.push("mipmap-anydpi-v26/ic_launcher.xml");
		files.push("mipmap-anydpi-v26/ic_launcher_round.xml");

		return files;
	}

	/**
	 * Validate Android-specific requirements
	 * @param {string} inputPath - Path to input file
	 */
	async validateInput(inputPath) {
		await super.validateInput(inputPath);

		// Android-specific validation could go here
		// For example, checking recommended dimensions for adaptive icons
	}

	/**
	 * Generate adaptive icon layers (foreground, background, monochrome)
	 * @param {object} adaptiveIcon - Adaptive icon configuration
	 * @param {string} outputDir - Output directory
	 */
	async generateAdaptiveIcons(adaptiveIcon, outputDir) {
		const { foreground, background, monochrome } = adaptiveIcon;

		console.log("\n📦 Generating adaptive icon layers...\n");

		// Validate adaptive layers
		const validation = await this.imageProcessor.validateAdaptiveLayers(
			foreground,
			background,
			monochrome
		);

		if (!validation.isValid) {
			throw new Error(validation.error);
		}

		// Generate all adaptive icon sizes in parallel
		const tasks = [];

		for (const sizeConfig of this.config.adaptiveIconSizes) {
			// Foreground layer
			tasks.push(
				this.generateAdaptiveLayer(
					foreground,
					sizeConfig,
					"ic_launcher_foreground.png",
					outputDir
				)
			);

			// Background layer
			tasks.push(
				this.generateAdaptiveLayer(
					background,
					sizeConfig,
					"ic_launcher_background.png",
					outputDir
				)
			);

			// Monochrome layer (use foreground if not provided)
			const monoSource = monochrome || foreground;
			tasks.push(
				this.generateAdaptiveLayer(
					monoSource,
					sizeConfig,
					"ic_launcher_monochrome.png",
					outputDir
				)
			);
		}

		await Promise.all(tasks);

		// Create adaptive icon XML files
		await this.generateAdaptiveIconXml(outputDir, !!monochrome);
	}

	/**
	 * Generate a single adaptive icon layer at a specific density
	 * @param {string} layerPath - Path to layer image or hex color
	 * @param {object} sizeConfig - Size configuration {density, size, folder}
	 * @param {string} filename - Output filename
	 * @param {string} outputDir - Base output directory
	 */
	async generateAdaptiveLayer(layerPath, sizeConfig, filename, outputDir) {
		const outputPath = path.join(outputDir, sizeConfig.folder, filename);

		// Determine if this is a foreground/monochrome layer (needs padding)
		// Background layers should fill entire space
		const isForeground =
			filename.includes("foreground") || filename.includes("monochrome");

		const preparedLayer = await this.imageProcessor.prepareAdaptiveLayer(
			layerPath,
			sizeConfig.size,
			isForeground, // Add padding for foreground/monochrome layers
			Platform.ANDROID // Use Android platform for correct padding ratio
		);

		// Save directly without resizing - prepareAdaptiveLayer already sized correctly
		await this.imageProcessor.saveImage(preparedLayer, outputPath);

		console.log(
			`   ✓ ${sizeConfig.folder}/${filename} (${sizeConfig.size}x${sizeConfig.size}px)`
		);
	}

	/**
	 * Generate adaptive icon XML files (mipmap-anydpi-v26)
	 * @param {string} outputDir - Output directory
	 * @param {boolean} hasMonochrome - Whether monochrome layer exists
	 */
	async generateAdaptiveIconXml(outputDir, hasMonochrome) {
		const xmlDir = path.join(outputDir, "mipmap-anydpi-v26");
		await this.fileManager.ensureDirectory(xmlDir);

		// Generate ic_launcher.xml
		const launcherXml = this.createAdaptiveIconXml(hasMonochrome);
		const launcherPath = path.join(xmlDir, "ic_launcher.xml");
		await this.fileManager.writeXml(launcherPath, launcherXml);
		console.log(`\n   ✓ mipmap-anydpi-v26/ic_launcher.xml`);

		// Generate ic_launcher_round.xml
		const roundPath = path.join(xmlDir, "ic_launcher_round.xml");
		await this.fileManager.writeXml(roundPath, launcherXml);
		console.log(`   ✓ mipmap-anydpi-v26/ic_launcher_round.xml`);
	}

	/**
	 * Create adaptive icon XML content
	 * @param {boolean} hasMonochrome - Whether to include monochrome layer
	 * @returns {string} XML content
	 */
	createAdaptiveIconXml(hasMonochrome) {
		let xml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>`;

		if (hasMonochrome) {
			xml += `
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>`;
		}

		xml += `
</adaptive-icon>`;

		return xml;
	}

	/**
	 * Generate legacy icons from adaptive layers (for backward compatibility)
	 * Combines foreground and background layers
	 * @param {object} adaptiveIcon - Adaptive icon configuration
	 * @param {string} outputDir - Output directory
	 */
	async generateLegacyFromAdaptive(adaptiveIcon, outputDir) {
		const { foreground, background } = adaptiveIcon;

		console.log("\n📦 Generating legacy icons (API 25 and below)...\n");

		// Load and prepare layers at same size
		const baseSize = 432; // Use xxhdpi as base

		// First, fully process the layers to buffers with explicit PNG format
		// Foreground gets padding, background fills entire space
		const fgLayer = await this.imageProcessor.prepareAdaptiveLayer(
			foreground,
			baseSize,
			true, // isForeground - adds padding/safe zone
			Platform.ANDROID // Use Android platform for correct padding ratio
		);
		const bgLayer = await this.imageProcessor.prepareAdaptiveLayer(
			background,
			baseSize,
			false, // isBackground - fills entire space
			Platform.ANDROID
		);

		// Convert both to PNG buffers to ensure they're properly formatted
		const fgBuffer = await fgLayer.png().toBuffer();
		const bgBuffer = await bgLayer.png().toBuffer();

		// Composite the layers and fully render to buffer
		const compositedBuffer = await sharp(bgBuffer)
			.composite([
				{
					input: fgBuffer,
					blend: "over",
				},
			])
			.png()
			.toBuffer();

		// Create a fresh Sharp instance from the composited buffer
		const composited = sharp(compositedBuffer);

		// Generate all legacy icon sizes
		await Promise.all(
			this.config.iconSizes.map(iconDef =>
				this.generateSingleIcon(composited, outputDir, iconDef)
			)
		);
	}
}
