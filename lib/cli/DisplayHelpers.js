/**
 * DisplayHelpers - Pure utility functions for CLI display formatting
 *
 * This module contains pure functions for formatting and displaying
 * information in the CLI. All functions are stateless with no side effects.
 *
 * Following functional programming principles for better testability
 */

import chalk from "chalk";
import boxen from "boxen";
import Table from "cli-table3";
import { Platform } from "../core/ImageProcessor.js";

/**
 * Get platform emoji
 * @pure
 * @param {string} platform - Platform name (Platform.IOS or Platform.ANDROID)
 * @returns {string} Emoji for platform
 */
export function getPlatformEmoji(platform) {
	const emojiMap = {
		[Platform.IOS]: "🍎",
		[Platform.ANDROID]: "🤖",
	};
	return emojiMap[platform.toLowerCase()] || "📱";
}

/**
 * Get combined platform emoji
 * @pure
 * @param {Array<string>} platforms - Array of platform names
 * @returns {string} Combined emoji string
 */
export function getCombinedPlatformEmoji(platforms) {
	if (platforms.length === 2) {
		return "🍎 🤖"; // Both platforms
	}
	if (platforms.includes(Platform.IOS)) {
		return "🍎"; // iOS only
	}
	if (platforms.includes(Platform.ANDROID)) {
		return "🤖"; // Android only
	}
	return "📱"; // Default
}

/**
 * Format platform names for display
 * @pure
 * @param {Array<string>} platforms - Array of platform names
 * @returns {string} Formatted platform names (e.g., "IOS + ANDROID")
 */
export function formatPlatformNames(platforms) {
	return platforms.map(p => p.toUpperCase()).join(" + ");
}

/**
 * Create header box for generation
 * @pure
 * @param {Array<string>} platforms - Platform names
 * @param {string} mode - Generation mode ("Adaptive Icon Mode" or "Standard Mode")
 * @returns {string} Formatted box string
 */
export function createHeaderBox(platforms, mode) {
	const platformNames = formatPlatformNames(platforms);
	const emoji = getCombinedPlatformEmoji(platforms);

	return boxen(
		chalk.bold.cyan(`${emoji}  ${platformNames} Icon Generator\n\n`) +
			chalk.gray(`Professional mobile app icons\n`) +
			chalk.yellow(`${mode}`),
		{
			padding: 1,
			margin: 1,
			borderStyle: "round",
			borderColor: "cyan",
			textAlignment: "center",
		}
	);
}

/**
 * Create completion box
 * @pure
 * @param {Array<object>} results - Generation results
 * @returns {string} Formatted completion box
 */
export function createCompletionBox(results) {
	let content = chalk.bold.green("✅  Generation Complete!\n\n");

	// Add output directories
	const outputPaths = results.map(r => chalk.white(r.outputDir));
	content += chalk.gray("Output:   ") + outputPaths.join("\n          ");

	// Add quick access commands
	content += chalk.gray("\n\nQuick access:\n");
	for (const result of results) {
		const platformLabel = result.platform === Platform.IOS ? "iOS" : "Android";
		content +=
			chalk.gray(`${platformLabel}: `) +
			chalk.white(`open ${result.outputDir}\n`);
	}

	return boxen(content.trimEnd(), {
		padding: 1,
		margin: 1,
		borderStyle: "round",
		borderColor: "green",
	});
}

/**
 * Format file path with clickable link
 * @pure
 * @param {string} filePath - File path
 * @param {string} color - Chalk color name
 * @returns {string} Formatted clickable path
 */
export function formatClickablePath(filePath, color = "cyan") {
	// This would use the makeClickable function from cli.js
	// For now, just return colored path
	return chalk[color](filePath);
}

/**
 * Format yes/no display
 * @pure
 * @param {boolean} value - Boolean value
 * @returns {string} Formatted yes/no string
 */
export function formatYesNo(value) {
	return value ? "✓ Yes" : "✗ No";
}

/**
 * Create configuration summary lines
 * @pure
 * @param {object} config - Configuration object
 * @returns {Array<string>} Array of formatted configuration lines
 */
export function createConfigLines(config) {
	const lines = [];

	if (config.adaptiveMode) {
		lines.push(
			chalk.gray("  Foreground:      ") + chalk.white(config.foreground)
		);
		lines.push(
			chalk.gray("  Background:      ") +
				chalk.white(config.background || "#111111 (default)")
		);
		if (config.monochrome) {
			lines.push(
				chalk.gray("  Monochrome:      ") + chalk.white(config.monochrome)
			);
		}
	} else {
		lines.push(chalk.gray("  Source Image:    ") + chalk.white(config.input));
	}

	lines.push(
		chalk.gray("  Output Directory:") + " " + chalk.white(config.outputDir)
	);
	lines.push(
		chalk.gray("  Target Platform: ") + chalk.white(config.platformNames)
	);
	lines.push(
		chalk.gray("  Create Archive:  ") + chalk.white(formatYesNo(config.zip))
	);
	lines.push(
		chalk.gray("  Overwrite Files: ") + chalk.white(formatYesNo(config.force))
	);

	return lines;
}

/**
 * Format platform result for display
 * @pure
 * @param {object} result - Generation result
 * @returns {Array<string>} Array of formatted result lines
 */
export function formatPlatformResult(result) {
	const platformEmoji = getPlatformEmoji(result.platform);
	const platformName = result.platform.toUpperCase();

	return [
		chalk.cyan(`  ${platformEmoji}  ${platformName}`),
		chalk.gray(`     Location: `) + chalk.white(result.outputDir),
		chalk.gray(`     Icons:    `) + chalk.white(`${result.files.length} files`),
		"", // Empty line for spacing
	];
}

/**
 * Show information about icon sizes for platforms
 * @param {string} platform - Platform to show info for (Platform.IOS, Platform.ANDROID, all)
 * @param {Function} getAllPlatformsInfoFn - Function to get platform info
 * @returns {void}
 */
export function showIconInfo(platform = Platform.All, getAllPlatformsInfoFn) {
	const platformsInfo = getAllPlatformsInfoFn();
	const targetPlatforms =
		platform === Platform.All
			? platformsInfo
			: platformsInfo.filter(p => p.key === platform.toLowerCase());

	for (const platformInfo of targetPlatforms) {
		const emoji = getPlatformEmoji(platformInfo.key);
		console.log(
			boxen(
				chalk.bold.blue(
					`${emoji}  ${platformInfo.name} Icon Specifications\n\n`
				) +
					chalk.gray(
						`Complete icon size reference for ${platformInfo.name} app development`
					),
				{
					padding: 1,
					margin: 1,
					borderStyle: "round",
					borderColor: "blue",
					textAlignment: "center",
				}
			)
		);

		const table = new Table({
			head:
				platformInfo.key === Platform.IOS
					? [
							chalk.cyan("Size (pt)"),
							chalk.cyan("Scale"),
							chalk.cyan("Pixels"),
							chalk.cyan("Use Case"),
					  ]
					: [
							chalk.cyan("Density"),
							chalk.cyan("DPI"),
							chalk.cyan("Size"),
							chalk.cyan("Use Case"),
					  ],
			colWidths: [15, 15, 12, 30],
		});

		platformInfo.sizeInfo.forEach(info => {
			if (platformInfo.key === Platform.IOS) {
				table.push([
					chalk.white(info.size),
					chalk.yellow(info.scale),
					chalk.green(info.pixels),
					chalk.gray(info.use),
				]);
			} else {
				table.push([
					chalk.white(info.density),
					chalk.yellow(info.dpi),
					chalk.green(info.size),
					chalk.gray(info.use),
				]);
			}
		});

		console.log(table.toString());

		console.log(
			chalk.bold.cyan("\n📊 Summary: ") +
				chalk.white(`${platformInfo.iconCount} icons`) +
				(platformInfo.key === Platform.IOS
					? chalk.gray(" + metadata file (Contents.json)")
					: chalk.gray(" across multiple density folders")) +
				"\n"
		);
	}
}

/**
 * Show all supported platforms
 * @param {Function} getAllPlatformsInfoFn - Function to get platform info
 * @returns {void}
 */
export function showPlatforms(getAllPlatformsInfoFn) {
	console.log(
		boxen(
			chalk.bold.magenta("📱  Supported Platforms\n\n") +
				chalk.gray("Generate professional icons for multiple platforms"),
			{
				padding: 1,
				margin: 1,
				borderStyle: "round",
				borderColor: "magenta",
				textAlignment: "center",
			}
		)
	);

	const platformsInfo = getAllPlatformsInfoFn();

	const table = new Table({
		head: [
			chalk.cyan("Platform"),
			chalk.cyan("Key"),
			chalk.cyan("Icons Generated"),
		],
		colWidths: [18, 12, 18],
	});

	platformsInfo.forEach(platform => {
		const emoji = getPlatformEmoji(platform.key);
		table.push([
			chalk.white(`${emoji}  ${platform.name}`),
			chalk.yellow(platform.key),
			chalk.green(`${platform.iconCount} files`),
		]);
	});

	console.log(table.toString());

	console.log(chalk.bold.cyan("\n💡 Usage Examples:\n"));
	console.log(chalk.gray("  Both platforms (default):"));
	console.log(
		chalk.white("    node cli.js generate -fg icon.png -o ./output\n")
	);
	console.log(chalk.gray("  Specific platform:"));
	console.log(
		chalk.white("    node cli.js generate -fg icon.png -o ./output -p ios")
	);
	console.log(
		chalk.white(
			"    node cli.js generate -fg icon.png -o ./output -p android\n"
		)
	);
}
