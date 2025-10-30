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
	.requiredOption(
		"-i, --input <path>",
		"Path to source image (preferably 512x512 or larger)"
	)
	.requiredOption("-o, --out <dir>", "Output directory")
	.option(
		"-p, --platform <platform>",
		"Target platform (ios, android, all)",
		"all"
	)
	.option("-z, --zip", "Create a ZIP archive of the generated icons")
	.option("-f, --force", "Overwrite existing output directory")
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
	const { input, out, zip, force, platform = "ios" } = options;

	// Determine which platforms to generate for
	const platforms =
		platform.toLowerCase() === "all"
			? getSupportedPlatforms()
			: [platform.toLowerCase()];

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

	console.log(
		boxen(
			chalk.bold.cyan(`${emoji}  ${platformNames} Icon Generator\n\n`) +
				chalk.gray("Professional mobile app icons from a single source"),
			{
				padding: 1,
				margin: 1,
				borderStyle: "round",
				borderColor: "cyan",
				textAlignment: "center",
			}
		)
	);

	// Validate input file
	const validateSpinner = ora("Validating input file...").start();

	if (!existsSync(input)) {
		validateSpinner.fail(chalk.red(`Input file not found: ${input}`));
		process.exit(1);
	}

	const isValid = await validateImageFile(input);
	if (!isValid) {
		validateSpinner.fail(chalk.red("Input file is not a valid image format"));
		process.exit(1);
	}

	validateSpinner.succeed(chalk.green("Input file validated"));

	// Show configuration
	console.log(chalk.bold("\n📋 Configuration\n"));
	console.log(
		chalk.gray("  Source Image:    ") + clickablePath(input, "white")
	);
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
		if (platforms.length === 1) {
			const result = await generateIconsForPlatform(platforms[0], input, out, {
				force,
				zip,
			});
			results = [result];
		} else {
			results = await generateIconsForMultiplePlatforms(platforms, input, out, {
				force,
				zip,
			});
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

		// Show results for each platform
		console.log(chalk.bold("\n📦 Generated Files\n"));

		for (const result of results) {
			if (!result.success) continue;

			const platformEmoji = result.platform === "ios" ? "🍎" : "🤖";
			console.log(
				chalk.bold.cyan(`  ${platformEmoji}  ${result.platform.toUpperCase()}`)
			);
			console.log(
				chalk.gray(`     Location: `) + clickablePath(result.outputDir)
			);
			console.log(
				chalk.gray(`     Icons:    `) +
					chalk.white(`${result.files.length} files`)
			);
			if (result.zipPath) {
				console.log(
					chalk.gray(`     Archive:  `) + clickablePath(result.zipPath)
				);
			}
			console.log();
		}

		// Show success message with clickable paths
		const outputDirs = results
			.map(r => clickablePath(r.outputDir))
			.join("\n           ");
		const zipPaths = results
			.filter(r => r.zipPath)
			.map(r => clickablePath(r.zipPath));

		// Build quick access commands based on number of platforms
		let quickAccessHint = "";
		if (results.length === 1) {
			quickAccessHint = chalk.gray(
				`\n  Quick access: ${chalk.white(`open ${results[0].outputDir}`)}`
			);
		} else {
			// Multiple platforms - show both commands
			const commands = results
				.map((r, idx) => {
					const platformLabel = r.platform === "ios" ? "iOS" : "Android";
					return `${chalk.gray(`${platformLabel}:`)} ${chalk.white(
						`open ${r.outputDir}`
					)}`;
				})
				.join("\n  ");
			quickAccessHint = chalk.gray(`\n  Quick access:\n  ${commands}`);
		}

		console.log(
			boxen(
				chalk.bold.green("✅  Generation Complete!\n\n") +
					chalk.gray("Output:   ") +
					outputDirs +
					(zipPaths.length > 0
						? "\n" + chalk.gray("Archives: ") + zipPaths.join("\n           ")
						: "") +
					quickAccessHint,
				{
					padding: 1,
					margin: 1,
					borderStyle: "round",
					borderColor: "green",
				}
			)
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

	// Environment variables with defaults
	const PORT = process.env.PORT || port;
	const HOST = process.env.HOST || "localhost";
	const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/ios-icon-uploads/";
	const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "52428800"); // 50MB default

	// Configure multer for file uploads
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

	// Health check endpoint
	app.get("/", (req, res) => {
		res.json({
			service: "ino-icon-maker",
			version: pkg.version,
			supportedPlatforms: getSupportedPlatforms(),
			supportedFormats: ["jpeg", "jpg", "png", "webp", "avif", "tiff"],
			defaultPlatform: "all",
			endpoints: {
				generate:
					'POST /generate?platform=all|ios|android (multipart/form-data with "file" field, default: all)',
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
	app.post("/generate", upload.single("file"), async (req, res) => {
		let tempOutputDir = null;

		try {
			if (!req.file) {
				return res.status(400).json({
					success: false,
					error: 'No file uploaded. Please provide a file in the "file" field.',
				});
			}

			// Get platform from query parameter or form data (default: all)
			const platform = req.query.platform || req.body.platform || "all";

			console.log(
				`\n📥 Received upload: ${req.file.originalname} (${
					req.file.size
				} bytes) for ${platform.toUpperCase()}`
			);

			// Validate platform
			const platforms =
				platform.toLowerCase() === "all"
					? getSupportedPlatforms()
					: [platform.toLowerCase()];

			for (const p of platforms) {
				if (!getSupportedPlatforms().includes(p)) {
					await fs.unlink(req.file.path);
					return res.status(400).json({
						success: false,
						error: `Unsupported platform: ${p}. Available: ${getSupportedPlatforms().join(
							", "
						)}`,
					});
				}
			}

			// Validate image file
			const isValid = await validateImageFile(req.file.path);
			if (!isValid) {
				await fs.unlink(req.file.path);
				return res.status(400).json({
					success: false,
					error: "Uploaded file is not a valid image format",
				});
			}

			// Create temporary output directory
			tempOutputDir = path.join("/tmp", `icons-${Date.now()}`);
			await fs.mkdir(tempOutputDir, { recursive: true });

			// Generate icons (always create zip for HTTP API)
			let results;
			if (platforms.length === 1) {
				const result = await generateIconsForPlatform(
					platforms[0],
					req.file.path,
					tempOutputDir,
					{
						force: true,
						zip: true,
					}
				);
				results = [result];
			} else {
				results = await generateIconsForMultiplePlatforms(
					platforms,
					req.file.path,
					tempOutputDir,
					{
						force: true,
						zip: true,
					}
				);
			}

			// Clean up uploaded file
			await fs.unlink(req.file.path);

			// Send ZIP file for single or multiple platforms
			if (
				results.length === 1 &&
				results[0].zipPath &&
				existsSync(results[0].zipPath)
			) {
				// Single platform: send the existing ZIP
				const zipName = `${results[0].platform}-icons.zip`;
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
					const combinedZipPath = path.join(tempOutputDir, "ios-icons.zip");

					// Create ZIP with archiver
					const output = createWriteStream(combinedZipPath);
					const archive = archiver("zip", { zlib: { level: 9 } });

					// Handle archive events
					await new Promise((resolve, reject) => {
						output.on("close", () => resolve());
						archive.on("error", err => reject(err));

						// Pipe archive to file
						archive.pipe(output);

						// Add all platform directories to the ZIP
						for (const result of results) {
							if (result.outputDir && existsSync(result.outputDir)) {
								const dirName = path.basename(result.outputDir);
								archive.directory(result.outputDir, dirName);
							}
						}

						// Finalize the archive
						archive.finalize();
					});

					console.log(`✅ Created combined ZIP: ${combinedZipPath}`);

					// Send the combined ZIP
					res.download(combinedZipPath, "ios-icons.zip", async err => {
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
			if (req.file && req.file.path) {
				try {
					await fs.unlink(req.file.path);
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
					chalk.gray(`  # iOS icons:\n`) +
					chalk.gray(
						`  curl -F "file=@icon.png" "http://${HOST}:${PORT}/generate?platform=ios" -o ios-icons.zip\n\n`
					) +
					chalk.gray(`  # Android icons:\n`) +
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
