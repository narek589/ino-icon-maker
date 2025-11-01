/**
 * ValidationHelpers - Pure utility functions for CLI validation
 *
 * This module contains pure functions for validating CLI inputs
 * and configurations. All functions are stateless and have no side effects.
 *
 * Following functional programming principles for better testability
 */

import { existsSync } from "fs";
import { validateImageFile } from "../generator.js";

/**
 * Check if adaptive mode is enabled based on options
 * @pure
 * @param {object} options - Generation options
 * @returns {boolean} True if adaptive mode is enabled
 */
export function isAdaptiveMode(options) {
	return !!options.foreground;
}

/**
 * Validate that required inputs are provided
 * @pure
 * @param {object} options - Generation options
 * @returns {object} Validation result {valid: boolean, error?: string}
 */
export function validateRequiredInputs(options) {
	const { input, foreground } = options;
	const adaptiveMode = isAdaptiveMode(options);

	if (!input && !adaptiveMode) {
		return {
			valid: false,
			error:
				"Either --input (-i) or --foreground (-fg) for adaptive mode are required",
		};
	}

	return { valid: true };
}

/**
 * Check if background is a hex color
 * @pure
 * @param {string} str - String to check
 * @returns {boolean} True if valid hex color
 */
export function isHexColor(str) {
	return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);
}

/**
 * Validate file existence
 * @param {string} filePath - Path to file
 * @param {string} fileType - Type of file (for error message)
 * @returns {object} Validation result {valid: boolean, error?: string}
 */
export function validateFileExists(filePath, fileType = "File") {
	if (!existsSync(filePath)) {
		return {
			valid: false,
			error: `${fileType} not found: ${filePath}`,
		};
	}
	return { valid: true };
}

/**
 * Validate background layer (can be file or hex color)
 * @param {string} background - Background path or color
 * @returns {Promise<object>} Validation result
 */
export async function validateBackground(background) {
	if (!background) {
		return { valid: true }; // Optional, defaults to #111111
	}

	const isColor = isHexColor(background);

	if (!isColor && !existsSync(background)) {
		return {
			valid: false,
			error: `Background must be a valid image file or hex color (e.g., #FF5722): ${background}`,
		};
	}

	// Validate image if not a color
	if (!isColor) {
		const isValid = await validateImageFile(background);
		if (!isValid) {
			return {
				valid: false,
				error: "Background layer is not a valid image format",
			};
		}
	}

	return { valid: true };
}

/**
 * Validate adaptive icon layers
 * @param {object} options - Options with foreground, background, monochrome
 * @returns {Promise<object>} Validation result
 */
export async function validateAdaptiveLayers(options) {
	const { foreground, background, monochrome } = options;

	// Validate foreground
	const fgExistsCheck = validateFileExists(foreground, "Foreground layer");
	if (!fgExistsCheck.valid) {
		return fgExistsCheck;
	}

	const fgValid = await validateImageFile(foreground);
	if (!fgValid) {
		return {
			valid: false,
			error: "Foreground layer is not a valid image format",
		};
	}

	// Validate background
	const bgValidation = await validateBackground(background);
	if (!bgValidation.valid) {
		return bgValidation;
	}

	// Validate monochrome (optional)
	if (monochrome) {
		const monoExistsCheck = validateFileExists(monochrome, "Monochrome layer");
		if (!monoExistsCheck.valid) {
			return monoExistsCheck;
		}

		const monoValid = await validateImageFile(monochrome);
		if (!monoValid) {
			return {
				valid: false,
				error: "Monochrome layer is not a valid image format",
			};
		}
	}

	return { valid: true };
}

/**
 * Validate standard input image
 * @param {string} inputPath - Path to input image
 * @returns {Promise<object>} Validation result
 */
export async function validateStandardInput(inputPath) {
	const existsCheck = validateFileExists(inputPath, "Input file");
	if (!existsCheck.valid) {
		return existsCheck;
	}

	const isValid = await validateImageFile(inputPath);
	if (!isValid) {
		return {
			valid: false,
			error: "Input file is not a valid image format",
		};
	}

	return { valid: true };
}
