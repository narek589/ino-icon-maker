/**
 * SizeConfigManager - Size Customization Manager
 *
 * Single Responsibility: Manage icon size customization
 * - Add custom sizes not in defaults
 * - Exclude specific sizes from generation
 * - Validate customization inputs
 *
 * Design Principles:
 * - Immutable: Never modifies base configs, returns modified copies
 * - Validates before applying changes
 * - Provides clear error messages
 */

export class SizeConfigManager {
	/**
	 * Apply size customization to a platform config
	 *
	 * @param {object} baseConfig - Base platform configuration (IOS_CONFIG or ANDROID_CONFIG)
	 * @param {object} customization - Customization options
	 * @param {object} [customization.ios] - iOS-specific customization
	 * @param {object} [customization.android] - Android-specific customization
	 * @returns {object} Modified config with customized sizes
	 */
	applySizeCustomization(baseConfig, customization) {
		if (!customization) {
			return baseConfig;
		}

		// Validate customization
		const validation = this.validateSizeCustomization(customization);
		if (!validation.valid) {
			throw new Error(`Invalid size customization: ${validation.error}`);
		}

		// Clone base config to avoid mutations
		const config = JSON.parse(JSON.stringify(baseConfig));

		// Determine platform-specific customization
		const platformKey = baseConfig.platformKey.toLowerCase();
		const platformCustomization = customization[platformKey] || {};

		// Add custom sizes
		if (
			platformCustomization.addSizes &&
			platformCustomization.addSizes.length > 0
		) {
			config.iconSizes = this.addCustomSizes(
				config.iconSizes,
				platformCustomization.addSizes,
				platformKey
			);

			console.log(
				`➕ Added ${platformCustomization.addSizes.length} custom size(s) to ${baseConfig.platformName}`
			);
		}

		// Exclude sizes
		if (
			platformCustomization.excludeSizes &&
			platformCustomization.excludeSizes.length > 0
		) {
			const originalCount = config.iconSizes.length;

			config.iconSizes = this.excludeSizes(
				config.iconSizes,
				platformCustomization.excludeSizes,
				platformKey
			);

			// Also exclude from adaptive icon sizes for Android
			if (config.adaptiveIconSizes) {
				config.adaptiveIconSizes = this.excludeSizes(
					config.adaptiveIconSizes,
					platformCustomization.excludeSizes,
					platformKey
				);
			}

			const excludedCount = originalCount - config.iconSizes.length;
			if (excludedCount > 0) {
				console.log(
					`➖ Excluded ${excludedCount} size(s) from ${baseConfig.platformName}`
				);
			}
		}

		return config;
	}

	/**
	 * Add custom sizes to the size array
	 *
	 * @param {Array} sizes - Existing size definitions
	 * @param {Array} additionalSizes - Custom sizes to add
	 * @param {string} platformKey - Platform identifier
	 * @returns {Array} Combined sizes
	 */
	addCustomSizes(sizes, additionalSizes, platformKey) {
		// Validate that custom sizes have required fields
		for (const customSize of additionalSizes) {
			if (platformKey === "ios") {
				if (!customSize.size || !customSize.scale || !customSize.filename) {
					throw new Error(
						`iOS custom size must have 'size', 'scale', and 'filename' fields: ${JSON.stringify(
							customSize
						)}`
					);
				}
			} else if (platformKey === "android") {
				if (
					!customSize.density ||
					typeof customSize.size !== "number" ||
					!customSize.folder ||
					!customSize.filename
				) {
					throw new Error(
						`Android custom size must have 'density', 'size' (number), 'folder', and 'filename' fields: ${JSON.stringify(
							customSize
						)}`
					);
				}
			}
		}

		// Return combined array
		return [...sizes, ...additionalSizes];
	}

	/**
	 * Exclude specific sizes from generation
	 *
	 * @param {Array} sizes - Size definitions
	 * @param {Array<string>} exclusions - Patterns to exclude
	 * @param {string} platformKey - Platform identifier
	 * @returns {Array} Filtered sizes
	 */
	excludeSizes(sizes, exclusions, platformKey) {
		return sizes.filter(sizeConfig => {
			for (const exclusion of exclusions) {
				if (platformKey === "ios") {
					// iOS exclusion patterns:
					// - "20x20@2x" - exact match
					// - "20x20" - matches all scales of this size
					// - "@2x" - matches all @2x icons
					const sizeScale = `${sizeConfig.size}@${sizeConfig.scale}`;
					if (exclusion === sizeScale) {
						return false; // Exact match
					}
					if (exclusion === sizeConfig.size) {
						return false; // Size match (any scale)
					}
					if (exclusion === `@${sizeConfig.scale}`) {
						return false; // Scale match (any size)
					}
				} else if (platformKey === "android") {
					// Android exclusion patterns:
					// - "ldpi" - exclude all ldpi density files
					// - "monochrome" - exclude all monochrome files
					// - "ic_launcher_round" - exclude all round launcher files
					// - "mipmap-ldpi" - exclude by folder name

					// Match by density
					if (exclusion === sizeConfig.density) {
						return false;
					}

					// Match by filename pattern (if filename exists)
					if (sizeConfig.filename && sizeConfig.filename.includes(exclusion)) {
						return false;
					}

					// Match by folder
					if (exclusion === sizeConfig.folder) {
						return false;
					}

					// Special case: "monochrome" excludes all *_monochrome.png files
					if (
						exclusion === "monochrome" &&
						sizeConfig.filename &&
						sizeConfig.filename.includes("monochrome")
					) {
						return false;
					}

					// Special case: "round" excludes all *_round.png files
					if (
						exclusion === "round" &&
						sizeConfig.filename &&
						sizeConfig.filename.includes("round")
					) {
						return false;
					}
				}
			}

			return true; // Not excluded
		});
	}

	/**
	 * Validate size customization options
	 *
	 * @param {object} customization - Customization to validate
	 * @returns {object} Validation result { valid: boolean, error?: string }
	 */
	validateSizeCustomization(customization) {
		if (!customization || typeof customization !== "object") {
			return { valid: false, error: "Customization must be an object" };
		}

		// Validate platform-specific customization
		for (const platform of ["ios", "android"]) {
			const platformCustomization = customization[platform];
			if (!platformCustomization) continue;

			if (typeof platformCustomization !== "object") {
				return {
					valid: false,
					error: `${platform} customization must be an object`,
				};
			}

			// Validate addSizes is an array
			if (
				platformCustomization.addSizes !== undefined &&
				!Array.isArray(platformCustomization.addSizes)
			) {
				return {
					valid: false,
					error: `${platform} addSizes must be an array`,
				};
			}

			// Validate excludeSizes is an array
			if (
				platformCustomization.excludeSizes !== undefined &&
				!Array.isArray(platformCustomization.excludeSizes)
			) {
				return {
					valid: false,
					error: `${platform} excludeSizes must be an array`,
				};
			}
		}

		return { valid: true };
	}

	/**
	 * Parse size customization from CLI options
	 *
	 * @param {object} options - CLI options
	 * @returns {object|null} Customization object or null if no customization
	 */
	parseFromCLI(options) {
		const customization = {};
		let hasCustomization = false;

		// Exclusions (comma-separated)
		if (options.exclude) {
			const exclusions = options.exclude
				.split(",")
				.map(s => s.trim())
				.filter(s => s.length > 0);

			if (exclusions.length > 0) {
				// Apply to both platforms if platform not specified
				// Users can use platform-specific patterns
				if (options.platform === "ios") {
					customization.ios = customization.ios || {};
					customization.ios.excludeSizes = exclusions;
				} else if (options.platform === "android") {
					customization.android = customization.android || {};
					customization.android.excludeSizes = exclusions;
				} else {
					// Apply to both
					customization.ios = customization.ios || {};
					customization.ios.excludeSizes = exclusions;
					customization.android = customization.android || {};
					customization.android.excludeSizes = exclusions;
				}
				hasCustomization = true;
			}
		}

		return hasCustomization ? customization : null;
	}
}

// Export singleton instance for convenience
export const sizeConfigManager = new SizeConfigManager();
