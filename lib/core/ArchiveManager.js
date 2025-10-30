/**
 * ArchiveManager - Single Responsibility: Handle archive operations
 * Creates and manages ZIP archives
 */

import archiver from "archiver";
import { createWriteStream } from "fs";

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

			output.on("close", () => {
				resolve(outputPath);
			});

			archive.on("error", err => {
				reject(err);
			});

			archive.pipe(output);

			if (archiveDirName) {
				archive.directory(sourceDir, archiveDirName);
			} else {
				archive.directory(sourceDir, false);
			}

			archive.finalize();
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
