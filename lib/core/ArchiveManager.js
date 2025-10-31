/**
 * ArchiveManager - Single Responsibility: Handle archive operations
 * Creates and manages ZIP archives
 */

import archiver from "archiver";
import { createWriteStream } from "fs";
import fs from "fs/promises";

export class ArchiveManager {
	/**
	 * Create a ZIP archive from a directory
	 * @param {string} sourceDir - Directory to archive
	 * @param {string} outputPath - Output ZIP file path
	 * @param {string} archiveDirName - Name of directory inside archive
	 * @param {number} compressionLevel - Compression level (0-9)
	 * @returns {Promise<string>} Path to created archive
	 */
	async createZipArchive(
		sourceDir,
		outputPath,
		archiveDirName = null,
		compressionLevel = 9
	) {
		return new Promise((resolve, reject) => {
			const output = createWriteStream(outputPath);
			const archive = archiver("zip", { zlib: { level: compressionLevel } });

			// Track if we've already resolved/rejected to prevent double calls
			let finished = false;

			output.on("close", async () => {
				if (!finished) {
					finished = true;

					// Wait for file to be fully written and readable
					try {
						// Try to open and close the file to ensure it's fully written
						const fileHandle = await fs.open(outputPath, "r");
						await fileHandle.close();

						// Small delay to ensure file system sync
						await new Promise(resolve => setTimeout(resolve, 100));

						resolve(outputPath);
					} catch (err) {
						reject(new Error(`Failed to verify archive file: ${err.message}`));
					}
				}
			});

			output.on("error", err => {
				if (!finished) {
					finished = true;
					reject(err);
				}
			});

			archive.on("error", err => {
				if (!finished) {
					finished = true;
					reject(err);
				}
			});

			archive.on("warning", err => {
				if (err.code === "ENOENT") {
					console.warn("Archive warning:", err);
				} else {
					// Don't treat warnings as errors
					console.warn("Archive warning:", err);
				}
			});

			archive.pipe(output);

			if (archiveDirName) {
				archive.directory(sourceDir, archiveDirName);
			} else {
				archive.directory(sourceDir, false);
			}

			const finalizePromise = archive.finalize();

			// Log when finalization completes
			finalizePromise
				.then(() => {
					console.log(`📦 Archive finalization complete for ${outputPath}`);
				})
				.catch(err => {
					console.error(`❌ Archive finalization error: ${err.message}`);
				});
		});
	}

	/**
	 * Get archive statistics
	 * @param {archiver} archive - Archive instance
	 * @returns {object} Archive stats
	 */
	getStats(archive) {
		return {
			totalBytes: archive.pointer(),
			totalFiles: archive._entriesCount,
		};
	}
}
