/**
 * ResponseHandler - Single Responsibility: Handle HTTP responses
 *
 * This class manages all response-related operations:
 * - Sending file downloads
 * - Creating combined archives
 * - Formatting JSON responses
 * - Error responses
 *
 * Separates response logic from business logic for better testability
 */

import path from "path";
import fs from "fs/promises";
import { existsSync, createWriteStream } from "fs";
import archiver from "archiver";

export class ResponseHandler {
	/**
	 * Send success JSON response
	 * @param {object} res - Express response object
	 * @param {object} data - Response data
	 * @returns {void}
	 */
	sendSuccess(res, data) {
		res.json({
			success: true,
			...data,
		});
	}

	/**
	 * Send error JSON response
	 * @param {object} res - Express response object
	 * @param {number} statusCode - HTTP status code
	 * @param {string} error - Error message
	 * @returns {void}
	 */
	sendError(res, statusCode, error) {
		res.status(statusCode).json({
			success: false,
			error,
		});
	}

	/**
	 * Verify ZIP file is valid and readable
	 * @param {string} zipPath - Path to ZIP file
	 * @returns {Promise<object>} Validation result with file size
	 */
	async verifyZipFile(zipPath) {
		try {
			// Wait for file to be fully written
			await new Promise(resolve => setTimeout(resolve, 200));

			const stats = await fs.stat(zipPath);
			if (stats.size === 0) {
				return {
					valid: false,
					error: "Generated ZIP file is empty",
				};
			}

			// Verify file is readable
			const fileHandle = await fs.open(zipPath, "r");
			await fileHandle.close();

			return {
				valid: true,
				size: stats.size,
			};
		} catch (error) {
			return {
				valid: false,
				error: `Failed to verify ZIP file: ${error.message}`,
			};
		}
	}

	/**
	 * Send ZIP file as download
	 * @param {object} res - Express response object
	 * @param {string} zipPath - Path to ZIP file
	 * @param {string} downloadName - Download filename
	 * @param {Function} cleanupCallback - Callback to run after download
	 * @returns {Promise<void>}
	 */
	async sendZipDownload(res, zipPath, downloadName, cleanupCallback) {
		const verification = await this.verifyZipFile(zipPath);

		if (!verification.valid) {
			this.sendError(res, 500, verification.error);
			if (cleanupCallback) await cleanupCallback();
			return;
		}

		console.log(`✅ ZIP file ready: ${verification.size} bytes`);

		res.download(zipPath, downloadName, async err => {
			if (cleanupCallback) {
				await cleanupCallback();
			}
			if (err) {
				console.error("Download error:", err);
			}
		});
	}

	/**
	 * Create combined ZIP archive from multiple platform results
	 * @param {Array<object>} results - Generation results
	 * @param {string} outputDir - Output directory
	 * @returns {Promise<string>} Path to combined ZIP
	 */
	async createCombinedZip(results, outputDir) {
		const combinedZipPath = path.join(outputDir, "all-icons.zip");

		console.log(`📦 Creating combined ZIP at ${combinedZipPath}...`);

		const output = createWriteStream(combinedZipPath);
		const archive = archiver("zip", { zlib: { level: 9 } });

		// Setup promise to wait for archive completion
		const archivePromise = new Promise((resolve, reject) => {
			output.on("close", () => {
				console.log(`✅ Archive finalized, ${archive.pointer()} total bytes`);
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
			if (result.success && result.outputDir && existsSync(result.outputDir)) {
				const dirName = path.basename(result.outputDir);
				console.log(
					`📦 Adding ${dirName} (${result.platform}) to combined ZIP...`
				);
				archive.directory(result.outputDir, dirName);
			}
		}

		// Finalize the archive
		console.log("📦 Finalizing archive...");
		archive.finalize();

		// Wait for archive to complete
		await archivePromise;

		console.log(`✅ Created combined ZIP: ${combinedZipPath}`);

		return combinedZipPath;
	}

	/**
	 * Handle single platform response
	 * @param {object} res - Express response object
	 * @param {Array<object>} results - Generation results
	 * @param {Function} cleanupCallback - Cleanup callback
	 * @returns {Promise<void>}
	 */
	async handleSinglePlatformResponse(res, results, cleanupCallback) {
		const result = results[0];

		if (!result.zipPath || !existsSync(result.zipPath)) {
			this.sendError(res, 500, "Icon generation failed - no ZIP created");
			if (cleanupCallback) await cleanupCallback();
			return;
		}

		const zipName = `${result.platform}-icons.zip`;
		await this.sendZipDownload(res, result.zipPath, zipName, cleanupCallback);
	}

	/**
	 * Handle multiple platforms response
	 * @param {object} res - Express response object
	 * @param {Array<object>} results - Generation results
	 * @param {string} outputDir - Output directory
	 * @param {Function} cleanupCallback - Cleanup callback
	 * @returns {Promise<void>}
	 */
	async handleMultiplePlatformsResponse(
		res,
		results,
		outputDir,
		cleanupCallback
	) {
		try {
			const combinedZipPath = await this.createCombinedZip(results, outputDir);
			await this.sendZipDownload(
				res,
				combinedZipPath,
				"all-icons.zip",
				cleanupCallback
			);
		} catch (zipError) {
			console.error("Failed to create combined ZIP:", zipError);
			// Fallback to JSON response
			this.sendSuccess(res, {
				results,
				message: "Icons generated but failed to create combined ZIP",
			});
			if (cleanupCallback) await cleanupCallback();
		}
	}

	/**
	 * Handle generation response based on number of platforms
	 * @param {object} res - Express response object
	 * @param {Array<object>} results - Generation results
	 * @param {string} outputDir - Output directory
	 * @param {Function} cleanupCallback - Cleanup callback
	 * @returns {Promise<void>}
	 */
	async handleGenerationResponse(res, results, outputDir, cleanupCallback) {
		if (!results || results.length === 0) {
			this.sendError(res, 500, "Icon generation failed");
			if (cleanupCallback) await cleanupCallback();
			return;
		}

		if (results.length === 1) {
			await this.handleSinglePlatformResponse(res, results, cleanupCallback);
		} else {
			await this.handleMultiplePlatformsResponse(
				res,
				results,
				outputDir,
				cleanupCallback
			);
		}
	}
}
