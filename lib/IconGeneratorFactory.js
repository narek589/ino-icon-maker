/**
 * IconGeneratorFactory - Factory Pattern Implementation
 *
 * Implements Open/Closed Principle:
 * - Open for extension: Easy to add new platforms by registering them
 * - Closed for modification: No need to modify this class when adding new platforms
 *
 * Benefits:
 * - Centralized platform creation logic
 * - Easy to add new platforms without modifying existing code
 * - Automatic dependency injection
 */

import { ImageProcessor, Platform } from "./core/ImageProcessor.js";
import { FileManager } from "./core/FileManager.js";
import { ArchiveManager } from "./core/ArchiveManager.js";
import { IOSGenerator } from "./platforms/IOSGenerator.js";
import { AndroidGenerator } from "./platforms/AndroidGenerator.js";

export class IconGeneratorFactory {
	constructor() {
		// Registry of available platform generators
		this.generators = new Map();

		// Initialize shared dependencies (can be injected if needed)
		this.imageProcessor = new ImageProcessor();
		this.fileManager = new FileManager();
		this.archiveManager = new ArchiveManager();

		// Register default platforms
		this.registerDefaultPlatforms();
	}

	/**
	 * Register default supported platforms
	 */
	registerDefaultPlatforms() {
		this.registerPlatform(Platform.IOS, IOSGenerator);
		this.registerPlatform(Platform.ANDROID, AndroidGenerator);
	}

	/**
	 * Register a new platform generator
	 * This method makes the factory open for extension
	 *
	 * @param {string} platformKey - Platform identifier (e.g., Platform.IOS, Platform.ANDROID)
	 * @param {class} GeneratorClass - Platform generator class
	 */
	registerPlatform(platformKey, GeneratorClass) {
		this.generators.set(platformKey.toLowerCase(), GeneratorClass);
	}

	/**
	 * Create a platform generator instance
	 *
	 * @param {string} platform - Platform key (Platform.IOS, Platform.ANDROID)
	 * @param {object} [customSizes] - Optional size customization
	 * @returns {PlatformGenerator} Platform generator instance
	 * @throws {Error} If platform is not supported
	 */
	createGenerator(platform, customSizes = null) {
		const platformKey = platform.toLowerCase();

		if (!this.generators.has(platformKey)) {
			const available = Array.from(this.generators.keys()).join(", ");
			throw new Error(
				`Unsupported platform: ${platform}. Available platforms: ${available}`
			);
		}

		const GeneratorClass = this.generators.get(platformKey);

		// Inject dependencies into the generator
		return new GeneratorClass(
			this.imageProcessor,
			this.fileManager,
			this.archiveManager,
			customSizes
		);
	}

	/**
	 * Get list of supported platforms
	 * @returns {Array<string>} Array of platform keys
	 */
	getSupportedPlatforms() {
		return Array.from(this.generators.keys());
	}

	/**
	 * Check if a platform is supported
	 * @param {string} platform - Platform key
	 * @returns {boolean}
	 */
	isPlatformSupported(platform) {
		return this.generators.has(platform.toLowerCase());
	}

	/**
	 * Get platform information for all supported platforms
	 * @returns {Array<object>} Array of platform info objects
	 */
	getAllPlatformInfo() {
		const platforms = [];

		for (const [key, GeneratorClass] of this.generators.entries()) {
			const generator = new GeneratorClass(
				this.imageProcessor,
				this.fileManager,
				this.archiveManager
			);
			platforms.push({
				key,
				...generator.getPlatformInfo(),
			});
		}

		return platforms;
	}
}

// Export a singleton instance for convenience
export const iconGeneratorFactory = new IconGeneratorFactory();
