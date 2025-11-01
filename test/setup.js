/**
 * Test Setup and Global Utilities
 */

import { rm, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Test output directory
export const TEST_OUTPUT_DIR = path.join(process.cwd(), "test-output");

// Test fixtures directory
export const TEST_FIXTURES_DIR = path.join(
	process.cwd(),
	"test-directory",
	"input"
);

// Test configs directory
export const TEST_CONFIGS_DIR = path.join(
	process.cwd(),
	"test-directory",
	"configs"
);

/**
 * Clean up test output directory before tests
 */
export async function cleanupTestOutput() {
	if (existsSync(TEST_OUTPUT_DIR)) {
		await rm(TEST_OUTPUT_DIR, { recursive: true, force: true });
	}
	await mkdir(TEST_OUTPUT_DIR, { recursive: true });
}

/**
 * Clean up specific test directory
 */
export async function cleanupDir(dir) {
	if (existsSync(dir)) {
		await rm(dir, { recursive: true, force: true });
	}
}

/**
 * Check if directory exists and contains files
 */
export async function directoryHasFiles(dir) {
	if (!existsSync(dir)) return false;
	const fs = await import("fs/promises");
	const files = await fs.readdir(dir);
	return files.length > 0;
}

/**
 * Count files in directory recursively
 */
export async function countFilesInDir(dir, extension = null) {
	if (!existsSync(dir)) return 0;

	const fs = await import("fs/promises");
	let count = 0;

	async function walk(directory) {
		const files = await fs.readdir(directory, { withFileTypes: true });
		for (const file of files) {
			const fullPath = path.join(directory, file.name);
			if (file.isDirectory()) {
				await walk(fullPath);
			} else {
				if (!extension || file.name.endsWith(extension)) {
					count++;
				}
			}
		}
	}

	await walk(dir);
	return count;
}

/**
 * Get test icon path
 */
export function getTestIcon() {
	return path.join(TEST_FIXTURES_DIR, "icon.png");
}

/**
 * Get test foreground path
 */
export function getTestForeground() {
	return path.join(TEST_FIXTURES_DIR, "foreground.png");
}

/**
 * Get test background path
 */
export function getTestBackground() {
	return path.join(TEST_FIXTURES_DIR, "background.png");
}

/**
 * Get test config path
 */
export function getTestConfig(name) {
	return path.join(TEST_CONFIGS_DIR, `${name}.json`);
}
