/**
 * SizeConfigManager - Size Customization Manager
 *
 * Single Responsibility: Manage icon size customization
 * - Apply scale factors to default sizes
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
	 * @param {number} [customization.scale] - Global scale factor
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

		// Determine effective scale factor (platform-specific overrides global)
		const scaleFactor =
			platformCustomization.scale || customization.scale || 1.0;

		// Apply scale factor to icon sizes
		if (scaleFactor !== 1.0) {
			config.iconSizes = this.applyScaleFactor(
				config.iconSizes,
				scaleFactor,
				platformKey
			);

			// Also scale adaptive icon sizes for Android
			if (config.adaptiveIconSizes) {
				config.adaptiveIconSizes = this.applyScaleFactor(
					config.adaptiveIconSizes,
					scaleFactor,
					platformKey
				);
			}

			console.log(
				`📏 Applied ${scaleFactor}x scale factor to ${baseConfig.platformName} icons`
			);
		}

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
	 * Apply scale factor to all sizes
	 *
	 * @param {Array} sizes - Array of size definitions
	 * @param {number} scaleFactor - Scale factor to apply
	 * @param {string} platformKey - Platform identifier
	 * @returns {Array} Scaled sizes
	 */
	applyScaleFactor(sizes, scaleFactor, platformKey) {
		return sizes.map(sizeConfig => {
			const scaled = { ...sizeConfig };

			if (platformKey === "ios") {
				// iOS: size is "WxH", need to parse and scale
				const [width, height] = scaled.size.split("x").map(parseFloat);
				const scaledWidth = Math.round(width * scaleFactor);
				const scaledHeight = Math.round(height * scaleFactor);
				scaled.size = `${scaledWidth}x${scaledHeight}`;
			} else if (platformKey === "android") {
				// Android: size is a number
				if (typeof scaled.size === "number") {
					scaled.size = Math.round(scaled.size * scaleFactor);
				}
			}

			return scaled;
		});
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
						`iOS custom size must have 'size', 'scale', and 'filename' fields: ${JSON.stringify(customSize)}`
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
						`Android custom size must have 'density', 'size' (number), 'folder', and 'filename' fields: ${JSON.stringify(customSize)}`
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

					// Match by filename pattern
					if (sizeConfig.filename.includes(exclusion)) {
						return false;
					}

					// Match by folder
					if (exclusion === sizeConfig.folder) {
						return false;
					}

					// Special case: "monochrome" excludes all *_monochrome.png files
					if (
						exclusion === "monochrome" &&
						sizeConfig.filename.includes("monochrome")
					) {
						return false;
					}

					// Special case: "round" excludes all *_round.png files
					if (
						exclusion === "round" &&
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

		// Validate global scale factor
		if (customization.scale !== undefined) {
			if (typeof customization.scale !== "number") {
				return { valid: false, error: "Global scale must be a number" };
			}
			if (customization.scale <= 0 || customization.scale > 5) {
				return {
					valid: false,
					error: "Global scale must be between 0 and 5",
				};
			}
			if (customization.scale < 0.5 || customization.scale > 3) {
				console.warn(
					`⚠️  Warning: Scale factor ${customization.scale} is outside recommended range (0.5-3.0)`
				);
			}
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

			// Validate platform-specific scale
			if (platformCustomization.scale !== undefined) {
				if (typeof platformCustomization.scale !== "number") {
					return {
						valid: false,
						error: `${platform} scale must be a number`,
					};
				}
				if (
					platformCustomization.scale <= 0 ||
					platformCustomization.scale > 5
				) {
					return {
						valid: false,
						error: `${platform} scale must be between 0 and 5`,
					};
				}
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

		// Global scale
		if (options.scale) {
			customization.scale = parseFloat(options.scale);
			hasCustomization = true;
		}

		// iOS-specific
		if (options.iosScale) {
			customization.ios = customization.ios || {};
			customization.ios.scale = parseFloat(options.iosScale);
			hasCustomization = true;
		}

		// Android-specific
		if (options.androidScale) {
			customization.android = customization.android || {};
			customization.android.scale = parseFloat(options.androidScale);
			hasCustomization = true;
		}

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

