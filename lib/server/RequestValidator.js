/**
 * RequestValidator - Single Responsibility: Validate HTTP requests
 *
 * This class handles all request validation logic including:
 * - File upload validation
 * - Platform validation
 * - Adaptive icon mode detection
 * - Input sanitization
 *
 * All methods are designed to be pure or have minimal side effects
 */

import { Platform } from "../core/ImageProcessor.js";
import { validateImageFile, getSupportedPlatforms } from "../generator.js";
import { sizeConfigManager } from "../core/SizeConfigManager.js";

export class RequestValidator {
	/**
	 * Detect generation mode from request
	 * @pure
	 * @param {object} files - Uploaded files object from multer
	 * @param {object} query - Query parameters
	 * @param {object} body - Request body
	 * @returns {object} Mode detection result
	 * @example
	 * // Legacy mode
	 * { mode: 'legacy', hasLegacyFile: true, hasForeground: false }
	 *
	 * // Adaptive mode
	 * { mode: 'adaptive', hasLegacyFile: false, hasForeground: true }
	 */
	detectGenerationMode(files, query, body) {
		const hasLegacyFile = files && files.file && files.file[0];
		const hasForeground = files && files.foreground && files.foreground[0];
		const hasBackgroundFile = files && files.background && files.background[0];
		const backgroundColor = query?.backgroundColor || body?.backgroundColor;

		const adaptiveMode = hasForeground;
		const mode = adaptiveMode ? "adaptive" : "legacy";

		return {
			mode,
			hasLegacyFile: !!hasLegacyFile,
			hasForeground: !!hasForeground,
			hasBackgroundFile: !!hasBackgroundFile,
			backgroundColor,
			adaptiveMode,
		};
	}

	/**
	 * Validate uploaded files exist
	 * @pure
	 * @param {object} modeInfo - Mode detection result from detectGenerationMode
	 * @returns {object} Validation result
	 */
	validateFilesExist(modeInfo) {
		const { hasLegacyFile, adaptiveMode } = modeInfo;

		if (!hasLegacyFile && !adaptiveMode) {
			return {
				valid: false,
				error:
					'No file uploaded. Please provide either: 1) a single "file" field (legacy mode), or 2) "foreground" + "background" fields (adaptive mode)',
			};
		}

		return { valid: true };
	}

	/**
	 * Validate platform parameter
	 * @pure
	 * @param {string} platform - Platform name
	 * @returns {object} Validation result with parsed platforms
	 */
	validatePlatform(platform = Platform.All) {
		const platforms =
			platform.toLowerCase() === Platform.All
				? getSupportedPlatforms()
				: [platform.toLowerCase()];

		const supportedPlatforms = getSupportedPlatforms();
		const invalidPlatforms = platforms.filter(
			p => !supportedPlatforms.includes(p)
		);

		if (invalidPlatforms.length > 0) {
			return {
				valid: false,
				error: `Unsupported platform: ${invalidPlatforms.join(
					", "
				)}. Available: ${supportedPlatforms.join(", ")}`,
			};
		}

		return {
			valid: true,
			platforms,
		};
	}

	/**
	 * Validate image file format
	 * @param {string} filePath - Path to image file
	 * @returns {Promise<object>} Validation result
	 */
	async validateImageFormat(filePath) {
		try {
			const isValid = await validateImageFile(filePath);
			if (!isValid) {
				return {
					valid: false,
					error: "File is not a valid image format",
				};
			}
			return { valid: true };
		} catch (error) {
			return {
				valid: false,
				error: `Failed to validate image: ${error.message}`,
			};
		}
	}

	/**
	 * Validate all uploaded files in adaptive mode
	 * @param {object} files - Uploaded files from multer
	 * @returns {Promise<object>} Validation result with file paths
	 */
	async validateAdaptiveFiles(files) {
		const result = {
			valid: true,
			files: {},
		};

		// Validate foreground (required)
		if (!files.foreground || !files.foreground[0]) {
			return {
				valid: false,
				error: "Foreground layer is required for adaptive mode",
			};
		}

		const foregroundFile = files.foreground[0];
		const fgValidation = await this.validateImageFormat(foregroundFile.path);
		if (!fgValidation.valid) {
			return {
				valid: false,
				error: `Foreground: ${fgValidation.error}`,
			};
		}
		result.files.foreground = foregroundFile.path;

		// Validate background (optional - can be file or color)
		if (files.background && files.background[0]) {
			const backgroundFile = files.background[0];
			const bgValidation = await this.validateImageFormat(backgroundFile.path);
			if (!bgValidation.valid) {
				return {
					valid: false,
					error: `Background: ${bgValidation.error}`,
				};
			}
			result.files.background = backgroundFile.path;
		}

		// Validate monochrome (optional)
		if (files.monochrome && files.monochrome[0]) {
			const monochromeFile = files.monochrome[0];
			const monoValidation = await this.validateImageFormat(
				monochromeFile.path
			);
			if (!monoValidation.valid) {
				return {
					valid: false,
					error: `Monochrome: ${monoValidation.error}`,
				};
			}
			result.files.monochrome = monochromeFile.path;
		}

		return result;
	}

	/**
	 * Validate legacy mode file
	 * @param {object} files - Uploaded files from multer
	 * @returns {Promise<object>} Validation result with file path
	 */
	async validateLegacyFile(files) {
		if (!files.file || !files.file[0]) {
			return {
				valid: false,
				error: "No file uploaded",
			};
		}

		const file = files.file[0];
		const validation = await this.validateImageFormat(file.path);

		if (!validation.valid) {
			return validation;
		}

		return {
			valid: true,
			filePath: file.path,
		};
	}

	/**
	 * Check if string is a valid hex color
	 * @pure
	 * @param {string} str - String to check
	 * @returns {boolean} True if valid hex color
	 */
	isHexColor(str) {
		return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);
	}

	/**
	 * Extract uploaded file paths for cleanup
	 * @pure
	 * @param {object} files - Uploaded files from multer
	 * @returns {Array<string>} Array of file paths
	 */
	extractFilePaths(files) {
		const paths = [];

		if (files.file && files.file[0]) {
			paths.push(files.file[0].path);
		}
		if (files.foreground && files.foreground[0]) {
			paths.push(files.foreground[0].path);
		}
		if (files.background && files.background[0]) {
			paths.push(files.background[0].path);
		}
		if (files.monochrome && files.monochrome[0]) {
			paths.push(files.monochrome[0].path);
		}

		return paths;
	}

	/**
	 * Validate and parse custom size configuration
	 * @pure
	 * @param {object} query - Query parameters
	 * @param {object} body - Request body
	 * @returns {object} Validation result with parsed customSizes
	 */
	validateCustomSizes(query, body) {
		// Check if customSizes is provided in either query or body
		let customSizesStr = query?.customSizes || body?.customSizes;

		if (!customSizesStr) {
			// No custom sizes provided - this is valid (optional feature)
			return { valid: true, customSizes: null };
		}

		// Parse JSON if it's a string
		let customSizes;
		if (typeof customSizesStr === "string") {
			try {
				customSizes = JSON.parse(customSizesStr);
			} catch (error) {
				return {
					valid: false,
					error: `Invalid customSizes JSON: ${error.message}`,
				};
			}
		} else if (typeof customSizesStr === "object") {
			customSizes = customSizesStr;
		} else {
			return {
				valid: false,
				error: "customSizes must be a JSON string or object",
			};
		}

		// Validate using SizeConfigManager
		const validation = sizeConfigManager.validateSizeCustomization(customSizes);
		if (!validation.valid) {
			return {
				valid: false,
				error: `Invalid customSizes: ${validation.error}`,
			};
		}

		return {
			valid: true,
			customSizes,
		};
	}
}
