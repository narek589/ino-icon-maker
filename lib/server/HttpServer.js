/**
 * HttpServer - Single Responsibility: HTTP server setup and routing
 *
 * This class sets up the Express server with all routes and middleware.
 * Delegates responsibilities to specialized handlers:
 * - ServerConfig for configuration
 * - RequestValidator for validation
 * - IconGenerationHandler for generation
 * - ResponseHandler for responses
 *
 * Follows Dependency Inversion Principle: Depends on abstractions (handlers)
 */

import express from "express";
import multer from "multer";
import boxen from "boxen";
import chalk from "chalk";
import { ServerConfig } from "./ServerConfig.js";
import { RequestValidator } from "./RequestValidator.js";
import { IconGenerationHandler } from "./IconGenerationHandler.js";
import { ResponseHandler } from "./ResponseHandler.js";
import { getSupportedPlatforms, getAllPlatformsInfo } from "../generator.js";
import { Platform } from "../core/ImageProcessor.js";

export class HttpServer {
	/**
	 * Create HTTP server with optional configuration
	 * @param {object} options - Server options (passed to ServerConfig)
	 */
	constructor(options = {}) {
		this.config = new ServerConfig(options);
		this.validator = new RequestValidator();
		this.generationHandler = new IconGenerationHandler();
		this.responseHandler = new ResponseHandler();
		this.app = express();

		this.setupMiddleware();
		this.setupRoutes();
	}

	/**
	 * Setup Express middleware
	 * @private
	 */
	setupMiddleware() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	/**
	 * Configure multer for file uploads
	 * @private
	 * @returns {multer.Multer} Configured multer instance
	 */
	configureMulter() {
		return multer({
			dest: this.config.getUploadDir(),
			limits: {
				fileSize: this.config.getMaxFileSize(),
			},
			fileFilter: (req, file, cb) => {
				const allowedMimes = this.config.getAllowedMimeTypes();

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
	}

	/**
	 * Setup all routes
	 * @private
	 */
	setupRoutes() {
		// Health check endpoint
		this.app.get("/", (req, res) => {
			this.handleHealthCheck(req, res);
		});

		// Platforms info endpoint
		this.app.get("/platforms", (req, res) => {
			this.handlePlatformsInfo(req, res);
		});

		// Icon generation endpoint
		const upload = this.configureMulter();
		const uploadFields = upload.fields([
			{ name: "file", maxCount: 1 },
			{ name: "foreground", maxCount: 1 },
			{ name: "background", maxCount: 1 },
			{ name: "monochrome", maxCount: 1 },
		]);

		this.app.post("/generate", uploadFields, async (req, res) => {
			await this.handleGeneration(req, res);
		});

		// Error handling middleware
		this.app.use((err, req, res, next) => {
			this.handleError(err, req, res, next);
		});
	}

	/**
	 * Handle health check request
	 * @private
	 * @param {object} req - Express request
	 * @param {object} res - Express response
	 */
	async handleHealthCheck(req, res) {
		const pkg = await this.getPackageInfo();

		res.json({
			service: "ino-icon-maker",
			version: pkg.version,
			supportedPlatforms: getSupportedPlatforms(),
			supportedFormats: this.config.getSupportedFormats(),
			defaultPlatform: Platform.All,
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
	}

	/**
	 * Handle platforms info request
	 * @private
	 * @param {object} req - Express request
	 * @param {object} res - Express response
	 */
	handlePlatformsInfo(req, res) {
		this.responseHandler.sendSuccess(res, {
			platforms: getAllPlatformsInfo(),
		});
	}

	/**
	 * Handle icon generation request
	 * @private
	 * @param {object} req - Express request
	 * @param {object} res - Express response
	 */
	async handleGeneration(req, res) {
		let tempOutputDir = null;
		const uploadedFiles = [];

		try {
			// Step 1: Detect generation mode
			const modeInfo = this.validator.detectGenerationMode(
				req.files,
				req.query,
				req.body
			);

			console.log("\n🔍 Debug info:");
			console.log("  Mode:", modeInfo.mode);
			console.log("  Files:", req.files ? Object.keys(req.files) : "none");

			// Step 2: Validate files exist
			const filesValidation = this.validator.validateFilesExist(modeInfo);
			if (!filesValidation.valid) {
				return this.responseHandler.sendError(res, 400, filesValidation.error);
			}

			// Step 3: Validate platform
			const platform =
				req.query?.platform || req.body?.platform || Platform.All;
			const platformValidation = this.validator.validatePlatform(platform);
			if (!platformValidation.valid) {
				return this.responseHandler.sendError(
					res,
					400,
					platformValidation.error
				);
			}

			const { platforms } = platformValidation;

			// Step 4: Extract and track uploaded files for cleanup
			const filePaths = this.validator.extractFilePaths(req.files);
			uploadedFiles.push(...filePaths);

			// Step 5: Validate uploaded files based on mode
			let validatedFiles = {};
			let inputFile = null;

			if (modeInfo.adaptiveMode) {
				const validation = await this.validator.validateAdaptiveFiles(
					req.files
				);
				if (!validation.valid) {
					await this.generationHandler.cleanupFiles(uploadedFiles);
					return this.responseHandler.sendError(res, 400, validation.error);
				}
				validatedFiles = validation.files;

				console.log(
					`\n📥 Received adaptive icon upload for ${platform.toUpperCase()}:`
				);
				console.log(`   Foreground: ${req.files.foreground[0].originalname}`);
				if (req.files.background && req.files.background[0]) {
					console.log(`   Background: ${req.files.background[0].originalname}`);
				} else if (modeInfo.backgroundColor) {
					console.log(`   Background: ${modeInfo.backgroundColor} (color)`);
				} else {
					console.log(`   Background: #111111 (default)`);
				}
			} else {
				const validation = await this.validator.validateLegacyFile(req.files);
				if (!validation.valid) {
					await this.generationHandler.cleanupFiles(uploadedFiles);
					return this.responseHandler.sendError(res, 400, validation.error);
				}
				inputFile = validation.filePath;

				const file = req.files.file[0];
				console.log(
					`\n📥 Received upload: ${file.originalname} (${
						file.size
					} bytes) for ${platform.toUpperCase()}`
				);
			}

			// Step 6: Create temporary output directory
			tempOutputDir = await this.generationHandler.createTempOutputDir();

			// Step 7: Build generation options
			const options = this.generationHandler.buildGenerationOptions(
				modeInfo,
				validatedFiles,
				modeInfo.backgroundColor
			);

			// Step 8: Generate icons
			const adaptiveIcon = modeInfo.adaptiveMode ? options.adaptiveIcon : null;
			const results = await this.generationHandler.generate(
				platforms,
				modeInfo,
				inputFile,
				adaptiveIcon,
				tempOutputDir,
				options
			);

			// Step 9: Clean up uploaded files
			await this.generationHandler.cleanupFiles(uploadedFiles);

			// Step 10: Send response with cleanup callback
			const cleanupCallback = async () => {
				if (tempOutputDir) {
					await this.generationHandler.cleanupDirectory(tempOutputDir);
				}
			};

			await this.responseHandler.handleGenerationResponse(
				res,
				results,
				tempOutputDir,
				cleanupCallback
			);
		} catch (error) {
			console.error("Generation error:", error);

			// Clean up uploaded files and temp directory
			await this.generationHandler.cleanupFiles(uploadedFiles);
			if (tempOutputDir) {
				await this.generationHandler.cleanupDirectory(tempOutputDir);
			}

			this.responseHandler.sendError(res, 500, error.message);
		}
	}

	/**
	 * Handle errors
	 * @private
	 * @param {Error} err - Error object
	 * @param {object} req - Express request
	 * @param {object} res - Express response
	 * @param {Function} next - Next middleware
	 */
	handleError(err, req, res, next) {
		console.error("Server error:", err);
		this.responseHandler.sendError(
			res,
			500,
			err.message || "Internal server error"
		);
	}

	/**
	 * Get package information (version, etc.)
	 * @private
	 * @returns {Promise<object>} Package info
	 */
	async getPackageInfo() {
		try {
			const { createRequire } = await import("module");
			const require = createRequire(import.meta.url);
			return require("../../package.json");
		} catch (error) {
			return { version: "unknown" };
		}
	}

	/**
	 * Start the server
	 * @param {Function} callback - Optional callback after server starts
	 * @returns {object} HTTP server instance
	 */
	async start(callback) {
		const port = this.config.getPort();
		const host = this.config.getHost();
		const pkg = await this.getPackageInfo();

		const server = this.app.listen(port, host, () => {
			console.log(
				boxen(
					chalk.bold.green("🚀 ino-icon-maker API\n\n") +
						chalk.white("Server:    ") +
						chalk.cyan(`http://${host}:${port}\n`) +
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
							`  curl -F "file=@icon.png" "http://${host}:${port}/generate" -o all-icons.zip\n\n`
						) +
						chalk.gray(`  # iOS only:\n`) +
						chalk.gray(
							`  curl -F "file=@icon.png" "http://${host}:${port}/generate?platform=ios" -o ios-icons.zip\n\n`
						) +
						chalk.gray(`  # Android only:\n`) +
						chalk.gray(
							`  curl -F "file=@icon.png" "http://${host}:${port}/generate?platform=android" -o android-icons.zip`
						),
					{
						padding: 1,
						margin: 1,
						borderStyle: "round",
						borderColor: "green",
					}
				)
			);

			if (callback) callback();
		});

		return server;
	}

	/**
	 * Get Express app instance (for testing)
	 * @returns {express.Application}
	 */
	getApp() {
		return this.app;
	}
}
