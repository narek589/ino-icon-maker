/**
 * ProjectDetector - Detect React Native and Flutter projects
 *
 * Single Responsibility: Project type detection and path resolution
 * Used by CLI to auto-install icons to the correct locations
 */

import fs from "fs/promises";
import path from "path";
import { Platform } from "./ImageProcessor";

export class ProjectDetector {
	/**
	 * Detect project type in the current directory
	 * @param {string} [cwd=process.cwd()] - Directory to check
	 * @returns {Promise<object|null>} Project info or null if not detected
	 */
	async detectProject(cwd = process.cwd()) {
		const reactNative = await this.detectReactNative(cwd);
		if (reactNative) return reactNative;

		const flutter = await this.detectFlutter(cwd);
		if (flutter) return flutter;

		return null;
	}

	/**
	 * Detect React Native project
	 * @param {string} cwd - Directory to check
	 * @returns {Promise<object|null>}
	 */
	async detectReactNative(cwd) {
		try {
			// Check for package.json with react-native dependency
			const packageJsonPath = path.join(cwd, "package.json");
			const packageJsonExists = await this.fileExists(packageJsonPath);

			if (!packageJsonExists) return null;

			const packageJson = JSON.parse(
				await fs.readFile(packageJsonPath, "utf-8")
			);
			const hasReactNative =
				packageJson.dependencies?.["react-native"] ||
				packageJson.devDependencies?.["react-native"];

			if (!hasReactNative) return null;

			// Check for iOS and Android directories
			const iosDir = path.join(cwd, Platform.IOS);
			const androidDir = path.join(cwd, Platform.ANDROID);

			const iosExists = await this.directoryExists(iosDir);
			const androidExists = await this.directoryExists(androidDir);

			if (!iosExists && !androidExists) return null;

			// Try to find app name from iOS directory
			let appName = null;
			if (iosExists) {
				appName = await this.findReactNativeAppName(iosDir);
			}

			return {
				type: "react-native",
				name: packageJson.name || "app",
				appName: appName || packageJson.name || "app",
				paths: {
					ios: iosExists
						? path.join(
								iosDir,
								appName || packageJson.name,
								"Images.xcassets",
								"AppIcon.appiconset"
						  )
						: null,
					android: androidExists
						? path.join(androidDir, "app", "src", "main", "res")
						: null,
				},
				hasIos: iosExists,
				hasAndroid: androidExists,
			};
		} catch (error) {
			return null;
		}
	}

	/**
	 * Find React Native app name from iOS directory
	 * @param {string} iosDir - iOS directory path
	 * @returns {Promise<string|null>}
	 */
	async findReactNativeAppName(iosDir) {
		try {
			const entries = await fs.readdir(iosDir, { withFileTypes: true });
			for (const entry of entries) {
				if (
					entry.isDirectory() &&
					!entry.name.startsWith(".") &&
					entry.name !== "Pods" &&
					entry.name !== "build"
				) {
					// Check if this directory has Images.xcassets
					const assetsPath = path.join(iosDir, entry.name, "Images.xcassets");
					if (await this.directoryExists(assetsPath)) {
						return entry.name;
					}
				}
			}
			return null;
		} catch (error) {
			return null;
		}
	}

	/**
	 * Detect Flutter project
	 * @param {string} cwd - Directory to check
	 * @returns {Promise<object|null>}
	 */
	async detectFlutter(cwd) {
		try {
			// Check for pubspec.yaml
			const pubspecPath = path.join(cwd, "pubspec.yaml");
			const pubspecExists = await this.fileExists(pubspecPath);

			if (!pubspecExists) return null;

			// Check for Flutter directories
			const iosRunnerDir = path.join(cwd, "ios", "Runner", "Assets.xcassets");
			const androidResDir = path.join(
				cwd,
				"android",
				"app",
				"src",
				"main",
				"res"
			);

			const iosExists = await this.directoryExists(iosRunnerDir);
			const androidExists = await this.directoryExists(androidResDir);

			if (!iosExists && !androidExists) return null;

			// Try to get app name from pubspec.yaml
			const pubspecContent = await fs.readFile(pubspecPath, "utf-8");
			const nameMatch = pubspecContent.match(/^name:\s*(.+)$/m);
			const appName = nameMatch ? nameMatch[1].trim() : "app";

			return {
				type: "flutter",
				name: appName,
				appName: appName,
				paths: {
					ios: iosExists ? path.join(iosRunnerDir, "AppIcon.appiconset") : null,
					android: androidExists ? androidResDir : null,
				},
				hasIos: iosExists,
				hasAndroid: androidExists,
			};
		} catch (error) {
			return null;
		}
	}

	/**
	 * Check if file exists
	 * @param {string} filePath - Path to check
	 * @returns {Promise<boolean>}
	 */
	async fileExists(filePath) {
		try {
			const stats = await fs.stat(filePath);
			return stats.isFile();
		} catch {
			return false;
		}
	}

	/**
	 * Check if directory exists
	 * @param {string} dirPath - Path to check
	 * @returns {Promise<boolean>}
	 */
	async directoryExists(dirPath) {
		try {
			const stats = await fs.stat(dirPath);
			return stats.isDirectory();
		} catch {
			return false;
		}
	}

	/**
	 * Get installation paths for a project
	 * @param {object} projectInfo - Project info from detectProject
	 * @param {string} generatedIconsPath - Path to generated icons
	 * @returns {object} Installation plan
	 */
	getInstallationPlan(projectInfo, generatedIconsPath) {
		if (!projectInfo) return null;

		const plan = {
			projectType: projectInfo.type,
			projectName: projectInfo.name,
			installations: [],
		};

		if (projectInfo.hasIos && projectInfo.paths.ios) {
			plan.installations.push({
				platform: Platform.IOS,
				source: path.join(generatedIconsPath, "AppIcon.appiconset"),
				target: projectInfo.paths.ios,
			});
		}

		if (projectInfo.hasAndroid && projectInfo.paths.android) {
			plan.installations.push({
				platform: Platform.ANDROID,
				source: path.join(generatedIconsPath, "android-icons"),
				target: projectInfo.paths.android,
			});
		}

		return plan;
	}
}
