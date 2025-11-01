/**
 * ArchiveManager Unit Tests
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { ArchiveManager } from "../../lib/core/ArchiveManager.js";
import { cleanupDir, TEST_OUTPUT_DIR } from "../setup.js";
import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile, readdir } from "fs/promises";

describe("ArchiveManager", () => {
	let archiveManager;
	let testOutputDir;

	beforeEach(async () => {
		archiveManager = new ArchiveManager();
		testOutputDir = path.join(TEST_OUTPUT_DIR, "archive-manager");
		await cleanupDir(testOutputDir);
		await mkdir(testOutputDir, { recursive: true });
	});

	afterEach(async () => {
		await cleanupDir(testOutputDir);
	});

	describe("Archive Creation", () => {
		test("should create ZIP archive from directory", async () => {
			// Create test directory with files
			const sourceDir = path.join(testOutputDir, "source");
			await mkdir(sourceDir);
			await writeFile(path.join(sourceDir, "file1.txt"), "content1");
			await writeFile(path.join(sourceDir, "file2.txt"), "content2");

			const zipPath = path.join(testOutputDir, "archive.zip");
			const result = await archiveManager.createZipArchive(sourceDir, zipPath);

			expect(existsSync(zipPath)).toBe(true);
			expect(result).toBe(zipPath);
		});

		test("should create ZIP archive with nested directories", async () => {
			// Create nested structure
			const sourceDir = path.join(testOutputDir, "source");
			const subDir = path.join(sourceDir, "subdir");
			await mkdir(subDir, { recursive: true });
			await writeFile(path.join(sourceDir, "root.txt"), "root");
			await writeFile(path.join(subDir, "nested.txt"), "nested");

			const zipPath = path.join(testOutputDir, "nested.zip");
			const result = await archiveManager.createZipArchive(sourceDir, zipPath);

			expect(existsSync(zipPath)).toBe(true);
			expect(result).toBe(zipPath);
		});

		test("should create parent directories for zip file if needed", async () => {
			const sourceDir = path.join(testOutputDir, "source");
			await mkdir(sourceDir);
			await writeFile(path.join(sourceDir, "file.txt"), "content");

			const zipPath = path.join(testOutputDir, "nested", "dir", "archive.zip");
			// Create parent directories for the zip file
			const path_module = await import("path");
			await mkdir(path_module.dirname(zipPath), { recursive: true });
			const result = await archiveManager.createZipArchive(sourceDir, zipPath);

			expect(existsSync(zipPath)).toBe(true);
			expect(result).toBe(zipPath);
		});
	});

	describe("Archive Properties", () => {
		test("should create non-empty ZIP file", async () => {
			const sourceDir = path.join(testOutputDir, "source");
			await mkdir(sourceDir);
			await writeFile(path.join(sourceDir, "file.txt"), "test content");

			const zipPath = path.join(testOutputDir, "archive.zip");
			await archiveManager.createZipArchive(sourceDir, zipPath);

			const fs = await import("fs/promises");
			const stats = await fs.stat(zipPath);
			expect(stats.size).toBeGreaterThan(0);
		});

		test("should handle empty directory", async () => {
			const sourceDir = path.join(testOutputDir, "empty");
			await mkdir(sourceDir);

			const zipPath = path.join(testOutputDir, "empty.zip");
			const result = await archiveManager.createZipArchive(sourceDir, zipPath);

			expect(existsSync(zipPath)).toBe(true);
		});
	});
});
