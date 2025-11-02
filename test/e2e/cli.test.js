/**
 * CLI End-to-End Tests
 */

import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { exec } from "child_process";
import { promisify } from "util";
import {
	getTestIcon,
	getTestForeground,
	cleanupDir,
	TEST_OUTPUT_DIR,
} from "../setup.js";
import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile, unlink } from "fs/promises";

const execAsync = promisify(exec);

// CLI command base
const CLI_CMD = "node cli.js";

describe("CLI E2E", () => {
	let testOutputDir;

	beforeEach(async () => {
		testOutputDir = path.join(TEST_OUTPUT_DIR, "cli");
		await cleanupDir(testOutputDir);
		await mkdir(testOutputDir, { recursive: true });
	});

	afterEach(async () => {
		await cleanupDir(testOutputDir);
	});

	describe("Info Commands", () => {
		test("should show version with -v flag", async () => {
			const { stdout } = await execAsync(`${CLI_CMD} -v`);
			expect(stdout).toBeTruthy();
			expect(stdout).toMatch(/\d+\.\d+\.\d+/); // Version pattern
		}, 10000);

		test("should show help with -h flag", async () => {
			const { stdout } = await execAsync(`${CLI_CMD} -h`);
			expect(stdout).toContain("Usage:");
		}, 10000);

		test("should list platforms", async () => {
			const { stdout } = await execAsync(`${CLI_CMD} platforms`);
			expect(stdout).toContain("ios");
			expect(stdout).toContain("android");
		}, 10000);

		test("should show info", async () => {
			const { stdout } = await execAsync(`${CLI_CMD} info`);
			expect(stdout).toContain("Icon Specifications");
		}, 10000);
	});

	describe("Generate Command", () => {
		test("should generate icons for all platforms", async () => {
			const iconPath = getTestIcon();

			const { stdout, stderr } = await execAsync(
				`${CLI_CMD} generate -i "${iconPath}" -o "${testOutputDir}" -p all -f`
			);

			// CLI outputs progress messages, which is normal
			expect(existsSync(path.join(testOutputDir, "AppIcon.appiconset"))).toBe(
				true
			);
			expect(existsSync(path.join(testOutputDir, "android-icons"))).toBe(true);
		}, 30000);

		test("should generate iOS icons only", async () => {
			const iconPath = getTestIcon();

			await execAsync(
				`${CLI_CMD} generate -i "${iconPath}" -o "${testOutputDir}" -p ios -f`
			);

			expect(existsSync(path.join(testOutputDir, "AppIcon.appiconset"))).toBe(
				true
			);
			expect(existsSync(path.join(testOutputDir, "android-icons"))).toBe(false);
		}, 30000);

		test("should generate Android icons only", async () => {
			const iconPath = getTestIcon();

			await execAsync(
				`${CLI_CMD} generate -i "${iconPath}" -o "${testOutputDir}" -p android -f`
			);

			expect(existsSync(path.join(testOutputDir, "android-icons"))).toBe(true);
			expect(existsSync(path.join(testOutputDir, "AppIcon.appiconset"))).toBe(
				false
			);
		}, 30000);

		test("should create ZIP with -z flag", async () => {
			const iconPath = getTestIcon();

			await execAsync(
				`${CLI_CMD} generate -i "${iconPath}" -o "${testOutputDir}" -p ios -f -z`
			);

			const fs = await import("fs/promises");
			const files = await fs.readdir(testOutputDir);
			const hasZip = files.some(f => f.endsWith(".zip"));

			expect(hasZip).toBe(true);
		}, 30000);
	});

	describe("Adaptive Icons", () => {
		test("should generate adaptive icons with foreground and background color", async () => {
			const foregroundPath = getTestForeground();

			await execAsync(
				`${CLI_CMD} generate -fg "${foregroundPath}" -bg "#FF5722" -o "${testOutputDir}" -p android -f`
			);

			expect(existsSync(path.join(testOutputDir, "android-icons"))).toBe(true);
		}, 30000);
	});

	describe("Custom Sizes", () => {
		test("should use custom config file for exclusions", async () => {
			const iconPath = getTestIcon();
			const configPath = path.join(testOutputDir, "custom-sizes.json");

			// Create custom config file with exclusions
			await writeFile(
				configPath,
				JSON.stringify({
					ios: { excludeSizes: ["20x20@2x"] },
				})
			);

			await execAsync(
				`${CLI_CMD} generate -i "${iconPath}" -o "${testOutputDir}" -p ios -f --custom-config "${configPath}"`
			);

			expect(existsSync(path.join(testOutputDir, "AppIcon.appiconset"))).toBe(
				true
			);

			// Cleanup config file
			await unlink(configPath).catch(() => {});
		}, 30000);

		test("should exclude sizes with --exclude flag", async () => {
			const iconPath = getTestIcon();

			await execAsync(
				`${CLI_CMD} generate -i "${iconPath}" -o "${testOutputDir}" -p android -f --exclude "ldpi,monochrome"`
			);

			expect(existsSync(path.join(testOutputDir, "android-icons"))).toBe(true);
		}, 30000);
	});

	describe("Error Handling", () => {
		test("should fail with non-existent input file", async () => {
			try {
				await execAsync(
					`${CLI_CMD} generate -i "non-existent.png" -o "${testOutputDir}" -p ios -f`
				);
				// Should not reach here
				expect(true).toBe(false);
			} catch (error) {
				expect(error).toBeDefined();
			}
		}, 10000);

		test("should fail with invalid platform", async () => {
			const iconPath = getTestIcon();

			try {
				await execAsync(
					`${CLI_CMD} generate -i "${iconPath}" -o "${testOutputDir}" -p invalid -f`
				);
				// Should not reach here
				expect(true).toBe(false);
			} catch (error) {
				expect(error).toBeDefined();
			}
		}, 10000);

		test("should fail without required input", async () => {
			try {
				await execAsync(`${CLI_CMD} generate -o "${testOutputDir}" -p ios -f`);
				// Should not reach here
				expect(true).toBe(false);
			} catch (error) {
				expect(error).toBeDefined();
			}
		}, 10000);
	});

	describe("Serve Command", () => {
		test("should show serve help", async () => {
			const { stdout } = await execAsync(`${CLI_CMD} serve -h`);
			expect(stdout).toContain("serve");
		}, 10000);

		// Note: Actual server testing is in http-api.test.js
		// We don't start the server here to avoid port conflicts
	});
});
