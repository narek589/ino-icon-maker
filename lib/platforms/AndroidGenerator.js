/**
 * AndroidGenerator - Android Platform Implementation
 *
 * Implements the PlatformGenerator interface for Android icon generation
 * Follows Liskov Substitution Principle - can be used wherever PlatformGenerator is expected
 */

import path from "path";
import { PlatformGenerator } from "./PlatformGenerator.js";
import { ANDROID_CONFIG } from "../config/android-config.js";

export class AndroidGenerator extends PlatformGenerator {
	/**
	 * Create Android generator with default dependencies
	 * @param {ImageProcessor} imageProcessor
	 * @param {FileManager} fileManager
	 * @param {ArchiveManager} archiveManager
	 */
	constructor(imageProcessor, fileManager, archiveManager) {
		super(ANDROID_CONFIG, imageProcessor, fileManager, archiveManager);
	}

	/**
	 * Generate all Android icon sizes
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
	 * Get list of generated files for Android
	 * @returns {Array<string>} List of file paths relative to output directory
	 */
	getGeneratedFiles() {
		return this.config.iconSizes.map(icon => `${icon.folder}/${icon.filename}`);
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
}
