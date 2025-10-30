/**
 * FileManager - Single Responsibility: Handle all file system operations
 * Provides abstraction for file I/O operations
 */

import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export class FileManager {
	/**
	 * Check if file exists
	 * @param {string} filePath - Path to check
	 * @returns {boolean}
	 */
	exists(filePath) {
		return existsSync(filePath);
	}

	/**
	 * Check if file is accessible
	 * @param {string} filePath - Path to check
	 * @returns {Promise<boolean>}
	 */
	async isAccessible(filePath) {
		try {
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Create directory recursively if it doesn't exist
	 * @param {string} dirPath - Directory path
	 * @param {object} options - Options
	 */
	async ensureDirectory(dirPath, options = { recursive: true }) {
		await fs.mkdir(dirPath, options);
	}

	/**
	 * Remove directory and all its contents
	 * @param {string} dirPath - Directory path
	 * @param {boolean} force - Force removal
	 */
	async removeDirectory(dirPath, force = false) {
		if (!force) {
			throw new Error(
				`Directory already exists: ${dirPath}\nUse --force to overwrite`
			);
		}
		await fs.rm(dirPath, { recursive: true });
	}

	/**
	 * Prepare output directory for icon generation
	 * @param {string} outputDir - Base output directory
	 * @param {string|null} subdirName - Subdirectory name (e.g., 'AppIcon.appiconset'), or null to use outputDir directly
	 * @param {boolean} force - Force overwrite if exists
	 * @returns {Promise<string>} Full path to prepared directory
	 */
	async prepareOutputDirectory(outputDir, subdirName, force = false) {
		// If subdirName is null or empty, use outputDir directly
		const fullPath = subdirName ? path.join(outputDir, subdirName) : outputDir;

		try {
			await fs.access(fullPath);
			// Directory exists
			if (!force) {
				throw new Error(
					`Output directory already exists: ${fullPath}\nUse --force to overwrite`
				);
			}
			console.log("⚠️  Output directory exists, overwriting (--force)...\n");
			// Only remove subdirectory if we have a subdirName, otherwise just ensure directory exists
			if (subdirName) {
				await fs.rm(fullPath, { recursive: true });
			}
		} catch (error) {
			// If it's not ENOENT (file not found), rethrow
			if (error.code !== "ENOENT") {
				throw error;
			}
			// Directory doesn't exist, which is fine - we'll create it
		}

		await this.ensureDirectory(fullPath);
		return fullPath;
	}

	/**
	 * Write JSON file with formatting
	 * @param {string} filePath - Path to output file
	 * @param {object} data - Data to write
	 * @param {number} indent - JSON indentation
	 */
	async writeJson(filePath, data, indent = 2) {
		await fs.writeFile(filePath, JSON.stringify(data, null, indent));
	}

	/**
	 * Delete a file
	 * @param {string} filePath - File to delete
	 */
	async deleteFile(filePath) {
		await fs.unlink(filePath);
	}

	/**
	 * Create a temporary directory with unique name
	 * @param {string} basePath - Base path for temp directory
	 * @param {string} prefix - Prefix for temp directory name
	 * @returns {Promise<string>} Path to created temp directory
	 */
	async createTempDirectory(basePath, prefix = "temp") {
		const tempDir = path.join(basePath, `${prefix}-${Date.now()}`);
		await this.ensureDirectory(tempDir);
		return tempDir;
	}
}
