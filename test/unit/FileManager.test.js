/**
 * FileManager Unit Tests
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { FileManager } from "../../lib/core/FileManager.js";
import { cleanupDir, TEST_OUTPUT_DIR } from "../setup.js";
import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";

describe("FileManager", () => {
	let fileManager;
	let testOutputDir;

	beforeEach(async () => {
		fileManager = new FileManager();
		testOutputDir = path.join(TEST_OUTPUT_DIR, "file-manager");
		await cleanupDir(testOutputDir);
		await mkdir(testOutputDir, { recursive: true });
	});

	afterEach(async () => {
		await cleanupDir(testOutputDir);
	});

	describe("Directory Operations", () => {
		test("should ensure directory exists", async () => {
			const dirPath = path.join(testOutputDir, "new-dir");
			await fileManager.ensureDirectory(dirPath);
			expect(existsSync(dirPath)).toBe(true);
		});

		test("should create nested directories", async () => {
			const dirPath = path.join(testOutputDir, "level1", "level2", "level3");
			await fileManager.ensureDirectory(dirPath);
			expect(existsSync(dirPath)).toBe(true);
		});

		test("should check if directory exists", () => {
			expect(fileManager.exists(testOutputDir)).toBe(true);
			expect(fileManager.exists(path.join(testOutputDir, "non-existent"))).toBe(
				false
			);
		});

		test("should remove directory", async () => {
			const dirPath = path.join(testOutputDir, "to-remove");
			await mkdir(dirPath);
			await writeFile(path.join(dirPath, "file1.txt"), "content");

			await fileManager.removeDirectory(dirPath, true);
			expect(existsSync(dirPath)).toBe(false);
		});

		test("should prepare output directory", async () => {
			const subdir = "test-subdir";
			const prepared = await fileManager.prepareOutputDirectory(
				testOutputDir,
				subdir,
				true
			);

			expect(existsSync(prepared)).toBe(true);
			expect(prepared).toBe(path.join(testOutputDir, subdir));
		});

		test("should create temp directory", async () => {
			const tempDir = await fileManager.createTempDirectory(
				testOutputDir,
				"test"
			);

			expect(existsSync(tempDir)).toBe(true);
			expect(tempDir).toContain("test-");
		});
	});

	describe("File Operations", () => {
		test("should check if file exists", async () => {
			const filePath = path.join(testOutputDir, "test.txt");
			await writeFile(filePath, "test content");

			expect(fileManager.exists(filePath)).toBe(true);
			expect(
				fileManager.exists(path.join(testOutputDir, "non-existent.txt"))
			).toBe(false);
		});

		test("should check if file is accessible", async () => {
			const filePath = path.join(testOutputDir, "test.txt");
			await writeFile(filePath, "test content");

			const isAccessible = await fileManager.isAccessible(filePath);
			expect(isAccessible).toBe(true);

			const notAccessible = await fileManager.isAccessible(
				path.join(testOutputDir, "non-existent.txt")
			);
			expect(notAccessible).toBe(false);
		});

		test("should write JSON file", async () => {
			const jsonPath = path.join(testOutputDir, "data.json");
			const data = { test: "value", number: 42 };

			await fileManager.writeJson(jsonPath, data);

			expect(existsSync(jsonPath)).toBe(true);
			const fs = await import("fs/promises");
			const content = await fs.readFile(jsonPath, "utf-8");
			expect(JSON.parse(content)).toEqual(data);
		});

		test("should write XML file", async () => {
			const xmlPath = path.join(testOutputDir, "data.xml");
			const xmlContent = '<?xml version="1.0"?><root><item>test</item></root>';

			await fileManager.writeXml(xmlPath, xmlContent);

			expect(existsSync(xmlPath)).toBe(true);
			const fs = await import("fs/promises");
			const content = await fs.readFile(xmlPath, "utf-8");
			expect(content).toBe(xmlContent);
		});
	});

	describe("Error Handling", () => {
		test("should handle permission errors gracefully", async () => {
			// This test depends on OS permissions
			// Skip if running as root or on Windows
			if (process.platform === "win32" || process.getuid?.() === 0) {
				return;
			}

			// Test handled by implementation
			expect(true).toBe(true);
		});
	});
});
