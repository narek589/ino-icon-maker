#!/usr/bin/env node

/**
 * Launcher Icon Generator - CLI Interface
 *
 * Generate iOS and Android app icon sets from a single source image
 * Supports: JPEG, JPG, PNG, WebP
 *
 * Provides both CLI and HTTP API interfaces with enhanced UX
 */

import "dotenv/config";
import { Command } from "commander";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import Table from "cli-table3";
import boxen from "boxen";
import {
	generateIconsForPlatform,
	generateIconsForMultiplePlatforms,
	validateImageFile,
	getSupportedPlatforms,
	getAllPlatformsInfo,
} from "./lib/generator.js";
import { ArchiveManager } from "./lib/core/ArchiveManager.js";
import archiver from "archiver";
import fs from "fs/promises";
import { existsSync, createWriteStream } from "fs";
import { pathToFileURL } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

const __filename = fileURLToPath(import.meta.url);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a clickable terminal link (OSC 8 hyperlink)
 * Supported by most modern terminals: iTerm2, Terminal.app, VS Code, etc.
 * @param {string} text - Display text
 * @param {string} filePath - Path to file/directory
 * @returns {string} Formatted clickable link
 */
function makeClickable(text, filePath) {
	// Check if terminal supports hyperlinks (most modern terminals do)
	const supportsHyperlinks = process.env.TERM_PROGRAM || process.stdout.isTTY;

	if (!supportsHyperlinks) {
		return text; // Fallback to plain text
	}

	try {
		// Convert to absolute path
		const absolutePath = path.resolve(filePath);

		// Convert to file:// URL
		const fileUrl = pathToFileURL(absolutePath).href;

		// OSC 8 format: \x1b]8;;URL\x1b\\TEXT\x1b]8;;\x1b\\
		const OSC = "\x1b]";
		const BEL = "\x07";
		const SEP = "\x1b\\";

		return `${OSC}8;;${fileUrl}${SEP}${text}${OSC}8;;${SEP}`;
	} catch (error) {
		// Fallback to plain text if something goes wrong
		return text;
	}
}

/**
 * Create a styled clickable path
 * @param {string} filePath - Path to file/directory
 * @param {string} color - Chalk color (default: cyan)
 * @returns {string} Styled clickable path
 */
function clickablePath(filePath, color = "cyan") {
	const displayPath = filePath;
	const clickable = makeClickable(displayPath, filePath);
	return chalk[color](clickable);
}

// ============================================================================
// CLI Interface
// ============================================================================

const program = new Command();

program
	.name("ino-icon")
	.description(
		chalk.cyan(
			"Generate iOS and Android app icon sets from a single source image"
		)
	)
	.version(pkg.version, "-v, --version", "Show version number");

program
	.command("generate")
	.description("Generate icons from a source image")
	.option("-i, --input <path>", "Path to source image (for legacy mode or iOS)")
	.option("-o, --out <dir>", "Output directory (default: icons)", "icons")
	.option(
		"-p, --platform <platform>",
		"Target platform (ios, android, all)",
		"all"
	)
	.option("-z, --zip", "Create a ZIP archive of the generated icons")
	.option("-f, --force", "Overwrite existing output directory")
	.option(
		"-fg, --foreground <path>",
		"Foreground layer for Android adaptive icons"
	)
	.option(
		"-bg, --background <path>",
		"Background layer for adaptive icons (image file or hex color like #FF5722, defaults to #111111)"
	)
	.option(
		"-m, --monochrome <path>",
		"Monochrome layer for Android adaptive icons (optional)"
	)
	.action(async options => {
		await generateWithProgress(options);
	});

program
	.command("create <image>")
	.description("Quick create - generate icons from image (output to ./icons)")
	.option("-o, --out <dir>", "Output directory", "./icons")
	.option(
		"-p, --platform <platform>",
		"Target platform (ios, android, all)",
		"all"
	)
	.option("-z, --zip", "Create a ZIP archive of the generated icons")
	.option("-f, --force", "Overwrite existing output directory")
	.action(async (image, options) => {
		await generateWithProgress({
			input: image,
			out: options.out,
			platform: options.platform,
			zip: options.zip,
			force: options.force,
		});
	});

program
	.command("interactive")
	.alias("i")
	.description("Interactive mode with prompts")
	.action(async () => {
		await interactiveMode();
	});

program
	.command("info")
	.description("Show information about generated icon sizes")
	.option(
		"-p, --platform <platform>",
		"Platform to show info for (ios, android, all)",
		"all"
	)
	.action(options => {
		showIconInfo(options.platform);
	});

program
	.command("platforms")
	.alias("list")
	.description("List all supported platforms")
	.action(() => {
		showPlatforms();
	});

program
	.command("serve")
	.description("Start HTTP API server")
	.option("-p, --port <number>", "Port number", "3000")
	.action(options => {
		startServer(parseInt(options.port));
	});

// If no command provided, show help
if (process.argv.length <= 2) {
	program.help();
}

program.parse();

// ============================================================================
// CLI Helper Functions
// ============================================================================

/**
 * Generate icons with progress indicators and colored output
 */
async function generateWithProgress(options) {
	const {
		input,
		out,
		zip,
		force,
		platform = "ios",
		foreground,
		background,
		monochrome,
	} = options;

	// Check if using adaptive icon mode (foreground is required, background defaults to #111111)
	const adaptiveMode = !!foreground;

	// Validate that either input OR adaptive layers are provided
	if (!input && !adaptiveMode) {
		console.error(
			chalk.red(
				"❌ Error: Either --input (-i) or --foreground (-fg) for adaptive mode are required\n"
			)
		);
		process.exit(1);
	}

	// Determine which platforms to generate for
	const platforms =
		platform.toLowerCase() === "all"
			? getSupportedPlatforms()
			: [platform.toLowerCase()];

	// Adaptive mode now supports both iOS and Android
	// iOS: Creates composite from layers (background + foreground with padding)
	// Android: Uses native adaptive icons with separate layers
	// No validation needed - both platforms work with layers!

	// Print header
	const platformNames = platforms.map(p => p.toUpperCase()).join(" + ");
	let emoji = "📱";
	if (platforms.length === 2) {
		emoji = "🍎 🤖"; // Both platforms
	} else if (platforms.includes("ios")) {
		emoji = "🍎"; // iOS only
	} else if (platforms.includes("android")) {
		emoji = "🤖"; // Android only
	}

	const mode = adaptiveMode ? "Adaptive Icon Mode" : "Standard Mode";
	console.log(
		boxen(
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
		)
	);

	// Validate input files
	const validateSpinner = ora("Validating input files...").start();

	if (adaptiveMode) {
		// Validate adaptive icon layers
		if (!existsSync(foreground)) {
			validateSpinner.fail(
				chalk.red(`Foreground layer not found: ${foreground}`)
			);
			process.exit(1);
		}

		// Background is optional (defaults to #111111)
		// If provided, check if it's a file or hex color
		if (background) {
			const isHexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(background);
			if (!isHexColor && !existsSync(background)) {
				validateSpinner.fail(
					chalk.red(
						`Background must be a valid image file or hex color (e.g., #FF5722): ${background}`
					)
				);
				process.exit(1);
			}

			// Validate background if it's an image
			if (!isHexColor) {
				const bgValid = await validateImageFile(background);
				if (!bgValid) {
					validateSpinner.fail(
						chalk.red("Background layer is not a valid image format")
					);
					process.exit(1);
				}
			}
		}

		if (monochrome && !existsSync(monochrome)) {
			validateSpinner.fail(
				chalk.red(`Monochrome layer not found: ${monochrome}`)
			);
			process.exit(1);
		}

		// Validate foreground image format
		const fgValid = await validateImageFile(foreground);
		if (!fgValid) {
			validateSpinner.fail(
				chalk.red("Foreground layer is not a valid image format")
			);
			process.exit(1);
		}

		// Validate monochrome if provided
		if (monochrome) {
			const monoValid = await validateImageFile(monochrome);
			if (!monoValid) {
				validateSpinner.fail(
					chalk.red("Monochrome layer is not a valid image format")
				);
				process.exit(1);
			}
		}
	} else {
		// Legacy mode - validate single input
		if (!existsSync(input)) {
			validateSpinner.fail(chalk.red(`Input file not found: ${input}`));
			process.exit(1);
		}

		const isValid = await validateImageFile(input);
		if (!isValid) {
			validateSpinner.fail(chalk.red("Input file is not a valid image format"));
			process.exit(1);
		}
	}

	validateSpinner.succeed(chalk.green("Input files validated"));

	// Show configuration
	console.log(chalk.bold("\n📋 Configuration\n"));

	if (adaptiveMode) {
		console.log(
			chalk.gray("  Foreground:      ") + clickablePath(foreground, "white")
		);
		console.log(
			chalk.gray("  Background:      ") +
				chalk.white(background || "#111111 (default)")
		);
		if (monochrome) {
			console.log(
				chalk.gray("  Monochrome:      ") + clickablePath(monochrome, "white")
			);
		}
	} else {
		console.log(
			chalk.gray("  Source Image:    ") + clickablePath(input, "white")
		);
	}

	console.log(
		chalk.gray("  Output Directory:") + " " + clickablePath(out, "white")
	);
	console.log(chalk.gray("  Target Platform: ") + chalk.white(platformNames));
	console.log(
		chalk.gray("  Create Archive:  ") + chalk.white(zip ? "✓ Yes" : "✗ No")
	);
	console.log(
		chalk.gray("  Overwrite Files: ") + chalk.white(force ? "✓ Yes" : "✗ No")
	);
	console.log();

	// Generate icons
	const generateSpinner = ora(`Generating ${platformNames} icons...`).start();

	try {
		// Temporarily suppress console logs during generation
		const originalLog = console.log;
		const logs = [];
		console.log = (...args) => logs.push(args.join(" "));

		let results;

		// Build options object
		const genOptions = {
			force,
			zip,
		};

		// Add adaptive icon configuration if in adaptive mode
		if (adaptiveMode) {
			genOptions.adaptiveIcon = {
				foreground,
				background: background || null, // null will default to #111111
				monochrome,
			};
		}

		if (platforms.length === 1) {
			const result = await generateIconsForPlatform(
				platforms[0],
				input,
				out,
				genOptions
			);
			results = [result];
		} else {
			// Handle mixed mode (iOS + Android with adaptive)
			if (adaptiveMode) {
				// Generate iOS with standard input
				const iosResult = await generateIconsForPlatform("ios", input, out, {
					force,
					zip,
				});
				// Generate Android with adaptive icons
				const androidResult = await generateIconsForPlatform(
					"android",
					input,
					out,
					genOptions
				);
				results = [iosResult, androidResult];
			} else {
				results = await generateIconsForMultiplePlatforms(
					platforms,
					input,
					out,
					genOptions
				);
			}
		}

		// Restore console.log
		console.log = originalLog;

		const totalIcons = results.reduce(
			(sum, r) => sum + (r.files ? r.files.length : 0),
			0
		);
		generateSpinner.succeed(
			chalk.green(
				`Successfully generated ${chalk.bold(
					totalIcons
				)} icons for ${chalk.bold(platforms.length)} platform${
					platforms.length > 1 ? "s" : ""
				}!`
			)
		);

		// Show platform-specific results
		console.log();
		for (const result of results) {
			if (!result.success) continue;

			const platformEmoji = result.platform === "ios" ? "🍎" : "🤖";
			const platformName = result.platform === "ios" ? "IOS" : "ANDROID";

			console.log(chalk.cyan(`  ${platformEmoji}  ${platformName}`));
			console.log(
				chalk.gray(`     Location: `) + chalk.white(result.outputDir)
			);
			console.log(
				chalk.gray(`     Icons:    `) +
					chalk.white(`${result.files.length} files`)
			);
			console.log();
		}

		// Build completion box content
		let boxContent = chalk.bold.green("✅  Generation Complete!\n\n");

		// Add output directories with full paths
		const outputPaths = results.map(r => {
			return chalk.white(r.outputDir);
		});
		boxContent += chalk.gray("Output:   ") + outputPaths.join("\n          ");

		// Add quick access commands with full paths
		boxContent += chalk.gray("\n\nQuick access:\n");
		for (const result of results) {
			const platformLabel = result.platform === "ios" ? "iOS" : "Android";
			boxContent +=
				chalk.gray(`${platformLabel}: `) +
				chalk.white(`open ${result.outputDir}\n`);
		}

		console.log(
			boxen(boxContent.trimEnd(), {
				padding: 1,
				margin: 1,
				borderStyle: "round",
				borderColor: "green",
			})
		);

		process.exit(0);
	} catch (error) {
		generateSpinner.fail(chalk.red("Generation failed"));
		console.error(chalk.red("\n❌ Error: " + error.message + "\n"));
		process.exit(1);
	}
}

/**
 * Interactive mode with prompts
 */
async function interactiveMode() {
	console.log(
		boxen(
			chalk.bold.magenta("🎨  Interactive Icon Generator\n\n") +
				chalk.gray("Step-by-step wizard for generating mobile app icons"),
			{
				padding: 1,
				margin: 1,
				borderStyle: "double",
				borderColor: "magenta",
				textAlignment: "center",
			}
		)
	);

	const answers = await inquirer.prompt([
		{
			type: "input",
			name: "input",
			message: "Enter the path to your source image:",
			validate: input => {
				if (!input) return "Please enter a file path";
				if (!existsSync(input)) return "File does not exist";
				return true;
			},
		},
		{
			type: "input",
			name: "output",
			message: "Enter the output directory:",
			default: "./output",
		},
		{
			type: "list",
			name: "platform",
			message: "Select target platform:",
			choices: [
				{ name: "Both iOS and Android", value: "all" },
				{ name: "iOS", value: "ios" },
				{ name: "Android", value: "android" },
			],
			default: "all",
		},
		{
			type: "confirm",
			name: "zip",
			message: "Create a ZIP archive?",
			default: false,
		},
		{
			type: "confirm",
			name: "force",
			message: "Overwrite existing files?",
			default: false,
		},
	]);

	console.log();
	await generateWithProgress({
		input: answers.input,
		out: answers.output,
		platform: answers.platform,
		zip: answers.zip,
		force: answers.force,
	});
}

/**
 * Show information about icon sizes
 */
function showIconInfo(platform = "all") {
	const platformsInfo = getAllPlatformsInfo();
	const targetPlatforms =
		platform === "all"
			? platformsInfo
			: platformsInfo.filter(p => p.key === platform.toLowerCase());

	for (const platformInfo of targetPlatforms) {
		const emoji = platformInfo.key === "ios" ? "🍎" : "🤖";
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
				platformInfo.key === "ios"
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
			if (platformInfo.key === "ios") {
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
				(platformInfo.key === "ios"
					? chalk.gray(" + metadata file (Contents.json)")
					: chalk.gray(" across multiple density folders")) +
				"\n"
		);
	}
}

/**
 * Show all supported platforms
 */
function showPlatforms() {
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

	const platformsInfo = getAllPlatformsInfo();

	const table = new Table({
		head: [
			chalk.cyan("Platform"),
			chalk.cyan("Key"),
			chalk.cyan("Icons Generated"),
		],
		colWidths: [18, 12, 18],
	});

	platformsInfo.forEach(platform => {
		const emoji = platform.key === "ios" ? "🍎" : "🤖";
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
		chalk.white("    node cli.js generate -i icon.png -o ./output\n")
	);
	console.log(chalk.gray("  Specific platform:"));
	console.log(
		chalk.white("    node cli.js generate -i icon.png -o ./output -p ios")
	);
	console.log(
		chalk.white("    node cli.js generate -i icon.png -o ./output -p android\n")
	);
}

// ============================================================================
// HTTP API Interface
// ============================================================================

/**
 * Start Express server with icon generation endpoint
 * @param {number} port - Port number to listen on
 */
function startServer(port = 3000) {
	const app = express();

	// Enable body parsing for JSON and URL-encoded data
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// Environment variables with defaults
	const PORT = process.env.PORT || port;
	const HOST = process.env.HOST || "localhost";
	const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/ios-icon-uploads/";
	const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "52428800"); // 50MB default

	// Configure multer for file uploads
	// Support both single file (legacy) and multiple files (adaptive icons)
	const upload = multer({
		dest: UPLOAD_DIR,
		limits: {
			fileSize: MAX_FILE_SIZE,
		},
		fileFilter: (req, file, cb) => {
			// Supported image formats
			const allowedMimes = [
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/webp",
				"image/avif",
				"image/tiff",
			];

			if (allowedMimes.includes(file.mimetype)) {
				cb(null, true);
			} else {
				cb(
					new Error(
						"Invalid file type. Supported formats: JPEG, PNG, WebP, AVIF, TIFF"
					)
				);
			}
		},
	});

	// Define upload fields for both legacy and adaptive modes
	const uploadFields = upload.fields([
		{ name: "file", maxCount: 1 }, // Legacy single image
		{ name: "foreground", maxCount: 1 }, // Adaptive foreground
		{ name: "background", maxCount: 1 }, // Adaptive background
		{ name: "monochrome", maxCount: 1 }, // Adaptive monochrome (optional)
	]);

	// Health check endpoint
	app.get("/", (req, res) => {
		res.json({
			service: "ino-icon-maker",
			version: pkg.version,
			supportedPlatforms: getSupportedPlatforms(),
			supportedFormats: ["jpeg", "jpg", "png", "webp", "avif", "tiff"],
			defaultPlatform: "all",
			features: {
				legacyIcons: "Single image for both iOS and Android",
				adaptiveIcons:
					"Android 8.0+ adaptive icons with separate foreground/background layers",
			},
			endpoints: {
				generate: {
					url: "POST /generate?platform=all|ios|android",
					legacyMode:
						'Single "file" field (multipart/form-data) for standard icons',
					adaptiveMode:
						'"foreground" + "background" fields for Android adaptive icons (background can be image file or use ?backgroundColor=#HEX query param)',
					optional: '"monochrome" field for themed icons',
				},
				platforms: "GET /platforms",
			},
		});
	});

	// Platforms info endpoint
	app.get("/platforms", (req, res) => {
		res.json({
			success: true,
			platforms: getAllPlatformsInfo(),
		});
	});

	// Icon generation endpoint
	app.post("/generate", uploadFields, async (req, res) => {
		let tempOutputDir = null;
		const uploadedFiles = [];

		try {
			// Detect mode: legacy (single file) or adaptive (multiple files)
			const hasLegacyFile = req.files && req.files.file && req.files.file[0];

			// Adaptive mode: requires foreground, background is optional (defaults to #111111)
			const hasForeground =
				req.files && req.files.foreground && req.files.foreground[0];

			const hasBackgroundFile =
				req.files && req.files.background && req.files.background[0];

			// Also support backgroundColor query param for solid color backgrounds
			const backgroundColor =
				req.query?.backgroundColor || req.body?.backgroundColor;

			// Adaptive mode is triggered by having a foreground layer
			// Background can be a file, color param, or will default to #111111
			const adaptiveMode = hasForeground;

			console.log("\n🔍 Debug info:");
			console.log("  hasLegacyFile:", !!hasLegacyFile);
			console.log("  hasForeground:", !!hasForeground);
			console.log("  hasBackgroundFile:", !!hasBackgroundFile);
			console.log("  backgroundColor:", backgroundColor);
			console.log("  req.files:", req.files ? Object.keys(req.files) : "none");
			console.log("  adaptiveMode:", adaptiveMode);

			if (!hasLegacyFile && !adaptiveMode) {
				return res.status(400).json({
					success: false,
					error:
						'No file uploaded. Please provide either: 1) a single "file" field (legacy mode), or 2) "foreground" + "background" fields (adaptive mode)',
				});
			}

			// Get platform from query parameter or form data (default: all)
			const platform = req.query?.platform || req.body?.platform || "all";

			if (adaptiveMode) {
				// Adaptive icon mode
				const foregroundFile = req.files.foreground[0];
				const backgroundFile = req.files.background
					? req.files.background[0]
					: null;
				const monochromeFile = req.files.monochrome
					? req.files.monochrome[0]
					: null;

				uploadedFiles.push(foregroundFile.path);
				if (backgroundFile) uploadedFiles.push(backgroundFile.path);
				if (monochromeFile) uploadedFiles.push(monochromeFile.path);

				console.log(
					`\n📥 Received adaptive icon upload for ${platform.toUpperCase()}:`
				);
				console.log(
					`   Foreground: ${foregroundFile.originalname} (${foregroundFile.size} bytes)`
				);
				if (backgroundFile) {
					console.log(
						`   Background: ${backgroundFile.originalname} (${backgroundFile.size} bytes)`
					);
				} else if (backgroundColor) {
					console.log(`   Background: ${backgroundColor} (color)`);
				} else {
					console.log(`   Background: #111111 (default)`);
				}
				if (monochromeFile) {
					console.log(
						`   Monochrome: ${monochromeFile.originalname} (${monochromeFile.size} bytes)`
					);
				}
			} else {
				// Legacy mode
				const file = req.files.file[0];
				uploadedFiles.push(file.path);

				console.log(
					`\n📥 Received upload: ${file.originalname} (${
						file.size
					} bytes) for ${platform.toUpperCase()}`
				);
			}

			// Validate platform
			const platforms =
				platform.toLowerCase() === "all"
					? getSupportedPlatforms()
					: [platform.toLowerCase()];

			for (const p of platforms) {
				if (!getSupportedPlatforms().includes(p)) {
					// Clean up uploaded files
					for (const filePath of uploadedFiles) {
						try {
							await fs.unlink(filePath);
						} catch (err) {
							// Ignore cleanup errors
						}
					}
					return res.status(400).json({
						success: false,
						error: `Unsupported platform: ${p}. Available: ${getSupportedPlatforms().join(
							", "
						)}`,
					});
				}
			}

			// Adaptive mode now supports both iOS and Android
			// iOS: Creates composite from layers (background + foreground with padding)
			// Android: Uses native adaptive icons with separate layers
			// Both platforms work with the unified layer-based workflow!

			// Validate image files
			if (adaptiveMode) {
				// Validate foreground
				const foregroundFile = req.files.foreground[0];
				const fgValid = await validateImageFile(foregroundFile.path);
				if (!fgValid) {
					for (const filePath of uploadedFiles) {
						await fs.unlink(filePath).catch(() => {});
					}
					return res.status(400).json({
						success: false,
						error: "Foreground file is not a valid image format",
					});
				}

				// Validate background if it's a file
				if (req.files.background && req.files.background[0]) {
					const backgroundFile = req.files.background[0];
					const bgValid = await validateImageFile(backgroundFile.path);
					if (!bgValid) {
						for (const filePath of uploadedFiles) {
							await fs.unlink(filePath).catch(() => {});
						}
						return res.status(400).json({
							success: false,
							error: "Background file is not a valid image format",
						});
					}
				}

				// Validate monochrome if provided
				if (req.files.monochrome && req.files.monochrome[0]) {
					const monochromeFile = req.files.monochrome[0];
					const monoValid = await validateImageFile(monochromeFile.path);
					if (!monoValid) {
						for (const filePath of uploadedFiles) {
							await fs.unlink(filePath).catch(() => {});
						}
						return res.status(400).json({
							success: false,
							error: "Monochrome file is not a valid image format",
						});
					}
				}
			} else {
				// Legacy mode - validate single file
				const file = req.files.file[0];
				const isValid = await validateImageFile(file.path);
				if (!isValid) {
					await fs.unlink(file.path).catch(() => {});
					return res.status(400).json({
						success: false,
						error: "Uploaded file is not a valid image format",
					});
				}
			}

			// Create temporary output directory
			tempOutputDir = path.join("/tmp", `icons-${Date.now()}`);
			await fs.mkdir(tempOutputDir, { recursive: true });

			// Build generation options
			const genOptions = {
				force: true,
				zip: true,
			};

			// Add adaptive icon configuration if in adaptive mode
			if (adaptiveMode) {
				const foregroundFile = req.files.foreground[0];
				const backgroundFile = req.files.background
					? req.files.background[0]
					: null;
				const monochromeFile = req.files.monochrome
					? req.files.monochrome[0]
					: null;

				genOptions.adaptiveIcon = {
					foreground: foregroundFile.path,
					background: backgroundFile
						? backgroundFile.path
						: backgroundColor || null, // null will default to #111111
					monochrome: monochromeFile ? monochromeFile.path : null,
				};
			}

			// Generate icons (always create zip for HTTP API)
			let results;
			const inputFile = hasLegacyFile ? req.files.file[0].path : null;

			if (platforms.length === 1) {
				// Single platform generation
				if (adaptiveMode && platforms[0] === "ios") {
					// iOS in adaptive mode - create composite from layers
					const { ImageProcessor } = await import(
						"./lib/core/ImageProcessor.js"
					);
					const imageProcessor = new ImageProcessor();

					const foregroundFile = req.files.foreground[0];
					const backgroundFile = req.files.background?.[0];
					const backgroundColor =
						req.query?.backgroundColor || req.body?.backgroundColor;

					const backgroundSource =
						backgroundFile?.path || backgroundColor || null;

					console.log(
						`\n🔨 Creating iOS composite from layers (background + centered foreground)...`
					);
					const iosComposite = await imageProcessor.createCompositeFromLayers(
						foregroundFile.path,
						backgroundSource,
						1024
					);

					const iosCompositePath = path.join(
						tempOutputDir,
						"ios-composite.png"
					);
					await iosComposite.png().toFile(iosCompositePath);

					const result = await generateIconsForPlatform(
						"ios",
						iosCompositePath,
						tempOutputDir,
						genOptions
					);

					// Clean up temporary composite
					try {
						await fs.unlink(iosCompositePath);
					} catch (err) {
						// Ignore
					}

					results = [result];
				} else {
					// Standard generation or Android adaptive
					const result = await generateIconsForPlatform(
						platforms[0],
						inputFile,
						tempOutputDir,
						genOptions
					);
					results = [result];
				}
			} else {
				// Handle mixed mode (iOS + Android with adaptive)
				if (adaptiveMode) {
					// Unified layer-based workflow for both platforms
					const { ImageProcessor } = await import(
						"./lib/core/ImageProcessor.js"
					);
					const imageProcessor = new ImageProcessor();

					const foregroundFile = req.files.foreground[0];
					const backgroundFile = req.files.background?.[0];
					const backgroundColor =
						req.query?.backgroundColor || req.body?.backgroundColor;

					// Determine background source (file, color, or null for #111111)
					const backgroundSource =
						backgroundFile?.path || backgroundColor || null;

					// For iOS: Create composite from layers (background + foreground with padding)
					console.log(
						`\n🔨 Creating iOS composite from layers (background + centered foreground)...`
					);
					const iosComposite = await imageProcessor.createCompositeFromLayers(
						foregroundFile.path,
						backgroundSource,
						1024 // 1024x1024 base size for iOS
					);

					// Save composite to temporary file for iOS generation
					const iosCompositePath = path.join(
						tempOutputDir,
						"ios-composite.png"
					);
					await iosComposite.png().toFile(iosCompositePath);

					// Generate iOS icons from composite
					const iosResult = await generateIconsForPlatform(
						"ios",
						iosCompositePath,
						tempOutputDir,
						{
							force: true,
							zip: true,
						}
					);

					// Generate Android with adaptive icons (separate layers)
					const androidResult = await generateIconsForPlatform(
						"android",
						null, // Not used in adaptive mode
						tempOutputDir,
						genOptions
					);

					// Clean up temporary composite
					try {
						await fs.unlink(iosCompositePath);
					} catch (err) {
						// Ignore cleanup errors
					}

					results = [iosResult, androidResult];
				} else {
					results = await generateIconsForMultiplePlatforms(
						platforms,
						inputFile,
						tempOutputDir,
						genOptions
					);
				}
			}

			// Clean up uploaded files
			for (const filePath of uploadedFiles) {
				try {
					await fs.unlink(filePath);
				} catch (err) {
					// Ignore cleanup errors
				}
			}

			// Send ZIP file for single or multiple platforms
			if (
				results.length === 1 &&
				results[0].zipPath &&
				existsSync(results[0].zipPath)
			) {
				// Single platform: send the existing ZIP
				const zipName = `${results[0].platform}-icons.zip`;

				// Verify the ZIP file is valid and not empty
				try {
					const stats = await fs.stat(results[0].zipPath);
					if (stats.size === 0) {
						throw new Error("Generated ZIP file is empty");
					}
					console.log(`✅ ZIP file ready: ${stats.size} bytes`);
				} catch (statErr) {
					console.error("Failed to verify ZIP file:", statErr);
					return res.status(500).json({
						success: false,
						error: "Generated ZIP file is invalid or empty",
					});
				}

				res.download(results[0].zipPath, zipName, async err => {
					// Clean up temp directory after download
					if (tempOutputDir) {
						try {
							await fs.rm(tempOutputDir, { recursive: true });
						} catch (cleanupErr) {
							console.error("Failed to clean up temp directory:", cleanupErr);
						}
					}

					if (err) {
						console.error("Download error:", err);
					}
				});
			} else if (results.length > 1) {
				// Multiple platforms: create combined ZIP
				try {
					const combinedZipPath = path.join(tempOutputDir, "all-icons.zip");

					console.log(`📦 Creating combined ZIP at ${combinedZipPath}...`);

					// Create ZIP with archiver
					const output = createWriteStream(combinedZipPath);
					const archive = archiver("zip", { zlib: { level: 9 } });

					// Setup promise to wait for archive completion
					const archivePromise = new Promise((resolve, reject) => {
						output.on("close", () => {
							console.log(
								`✅ Archive finalized, ${archive.pointer()} total bytes`
							);
							resolve();
						});

						output.on("end", () => {
							console.log("📦 Output stream ended");
						});

						output.on("error", err => {
							console.error("❌ Output stream error:", err);
							reject(err);
						});

						archive.on("error", err => {
							console.error("❌ Archive error:", err);
							reject(err);
						});

						archive.on("warning", err => {
							if (err.code === "ENOENT") {
								console.warn("⚠️  Archive warning:", err);
							} else {
								console.error("❌ Archive warning (critical):", err);
								reject(err);
							}
						});
					});

					// Pipe archive to file
					archive.pipe(output);

					// Add all platform directories to the ZIP
					for (const result of results) {
						if (
							result.success &&
							result.outputDir &&
							existsSync(result.outputDir)
						) {
							const dirName = path.basename(result.outputDir);
							console.log(
								`📦 Adding ${dirName} (${result.platform}) to combined ZIP...`
							);
							archive.directory(result.outputDir, dirName);
						}
					}

					// Finalize the archive (must be called AFTER adding all content)
					console.log("📦 Finalizing archive...");
					archive.finalize();

					// Wait for archive to complete
					await archivePromise;

					console.log(`✅ Created combined ZIP: ${combinedZipPath}`);

					// Verify the ZIP file is valid and not empty
					const stats = await fs.stat(combinedZipPath);
					if (stats.size === 0) {
						throw new Error("Generated combined ZIP file is empty");
					}
					console.log(`✅ Combined ZIP file ready: ${stats.size} bytes`);

					// Send the combined ZIP
					res.download(combinedZipPath, "all-icons.zip", async err => {
						// Clean up temp directory after download
						if (tempOutputDir) {
							try {
								await fs.rm(tempOutputDir, { recursive: true });
							} catch (cleanupErr) {
								console.error("Failed to clean up temp directory:", cleanupErr);
							}
						}

						if (err) {
							console.error("Download error:", err);
						}
					});
				} catch (zipError) {
					console.error("Failed to create combined ZIP:", zipError);
					// Fallback to JSON response
					res.json({
						success: true,
						results,
						message: "Icons generated but failed to create combined ZIP",
					});
				}
			} else {
				// No results
				res.status(500).json({
					success: false,
					error: "Icon generation failed",
				});
			}
		} catch (error) {
			console.error("Generation error:", error);

			// Clean up temp files
			for (const filePath of uploadedFiles) {
				try {
					await fs.unlink(filePath);
				} catch (err) {
					// Ignore cleanup errors
				}
			}

			if (tempOutputDir) {
				try {
					await fs.rm(tempOutputDir, { recursive: true });
				} catch (err) {
					// Ignore cleanup errors
				}
			}

			res.status(500).json({
				success: false,
				error: error.message,
			});
		}
	});

	// Error handling middleware
	app.use((err, req, res, next) => {
		console.error("Server error:", err);
		res.status(500).json({
			success: false,
			error: err.message || "Internal server error",
		});
	});

	// Start server
	app.listen(PORT, HOST, () => {
		console.log(
			boxen(
				chalk.bold.green("🚀 ino-icon-maker API\n\n") +
					chalk.white("Server:    ") +
					chalk.cyan(`http://${HOST}:${PORT}\n`) +
					chalk.white("Version:   ") +
					chalk.yellow(`v${pkg.version}\n`) +
					chalk.white("Platforms: ") +
					chalk.yellow(getSupportedPlatforms().join(", ")) +
					"\n" +
					chalk.white("Formats:   ") +
					chalk.yellow("JPEG, PNG, WebP, AVIF, TIFF") +
					"\n\n" +
					chalk.bold("Endpoints:\n") +
					chalk.gray("  GET  /platforms\n") +
					chalk.gray("  POST /generate?platform=<ios|android|all>\n\n") +
					chalk.bold("Examples:\n") +
					chalk.gray(`  # Both platforms (default):\n`) +
					chalk.gray(
						`  curl -F "file=@icon.png" "http://${HOST}:${PORT}/generate" -o all-icons.zip\n\n`
					) +
					chalk.gray(`  # iOS only:\n`) +
					chalk.gray(
						`  curl -F "file=@icon.png" "http://${HOST}:${PORT}/generate?platform=ios" -o ios-icons.zip\n\n`
					) +
					chalk.gray(`  # Android only:\n`) +
					chalk.gray(
						`  curl -F "file=@icon.png" "http://${HOST}:${PORT}/generate?platform=android" -o android-icons.zip`
					),
				{
					padding: 1,
					margin: 1,
					borderStyle: "round",
					borderColor: "green",
				}
			)
		);
	});
}
