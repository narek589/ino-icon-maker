/**
 * ProgressHelpers - Main orchestration functions for CLI icon generation
 *
 * This module contains the main workflow orchestration for generating icons
 * with progress indicators and user feedback.
 */

import chalk from "chalk";
import ora from "ora";
import {
	isAdaptiveMode,
	validateRequiredInputs,
	validateAdaptiveLayers,
	validateStandardInput,
} from "./ValidationHelpers.js";
import {
	createHeaderBox,
	createConfigLines,
	formatPlatformResult,
	createCompletionBox,
	formatPlatformNames,
} from "./DisplayHelpers.js";
import {
	determinePlatforms,
	buildGenerationOptions,
	executeGeneration,
	calculateTotalIcons,
	createSummaryMessage,
	installToProject,
} from "./GenerationHelpers.js";
import { Platform } from "../core/ImageProcessor.js";

/**
 * Generate icons with progress indicators and colored output
 * Main orchestration function for the CLI generation workflow
 *
 * @param {object} options - Generation options
 * @returns {Promise<void>}
 */
export async function generateWithProgress(options) {
	const { input, out, platform = Platform.IOS } = options;

	// Step 1: Validate required inputs
	const inputValidation = validateRequiredInputs(options);
	if (!inputValidation.valid) {
		console.error(chalk.red(`❌ Error: ${inputValidation.error}\n`));
		process.exit(1);
	}

	// Step 2: Determine platforms and mode
	const adaptiveMode = isAdaptiveMode(options);
	const platforms = determinePlatforms(platform);
	const mode = adaptiveMode ? "Adaptive Icon Mode" : "Standard Mode";

	// Step 3: Print header
	console.log(createHeaderBox(platforms, mode));

	// Step 4: Validate input files
	const validateSpinner = ora("Validating input files...").start();

	try {
		if (adaptiveMode) {
			const validation = await validateAdaptiveLayers(options);
			if (!validation.valid) {
				validateSpinner.fail(chalk.red(validation.error));
				process.exit(1);
			}
		} else {
			const validation = await validateStandardInput(input);
			if (!validation.valid) {
				validateSpinner.fail(chalk.red(validation.error));
				process.exit(1);
			}
		}
		validateSpinner.succeed(chalk.green("Input files validated"));
	} catch (error) {
		validateSpinner.fail(chalk.red(error.message));
		process.exit(1);
	}

	// Step 5: Show configuration
	console.log(chalk.bold("\n📋 Configuration\n"));
	const configLines = createConfigLines({
		adaptiveMode,
		foreground: options.foreground,
		background: options.background,
		monochrome: options.monochrome,
		input,
		outputDir: out,
		platformNames: formatPlatformNames(platforms),
		zip: options.zip,
		force: options.force,
		fgScale: options.fgScale,
		fgScaleIos: options.fgScaleIos,
		fgScaleAndroid: options.fgScaleAndroid,
	});
	configLines.forEach(line => console.log(line));
	console.log();

	// Step 6: Generate icons
	const platformNames = formatPlatformNames(platforms);
	const generateSpinner = ora(`Generating ${platformNames} icons...`).start();

	try {
		// Suppress console logs during generation
		const originalLog = console.log;
		console.log = () => {};

		// Build options and execute generation
		const genOptions = await buildGenerationOptions(options);
		const results = await executeGeneration(platforms, input, out, genOptions);

		// Restore console.log
		console.log = originalLog;

		// Step 7: Show success message
		const totalIcons = calculateTotalIcons(results);
		const summaryMessage = createSummaryMessage(totalIcons, platforms.length);
		generateSpinner.succeed(chalk.green(summaryMessage));

		// Step 8: Show platform-specific results
		console.log();
		for (const result of results) {
			if (!result.success) continue;
			const resultLines = formatPlatformResult(result);
			resultLines.forEach(line => console.log(line));
		}

		// Step 9: Install to project if requested
		if (options.install) {
			const installSpinner = ora("Installing icons to project...").start();
			try {
				// Suppress console.log temporarily
				const originalLog = console.log;
				console.log = () => {};

				const installResult = await installToProject(out, options);

				// Restore console.log
				console.log = originalLog;

				if (installResult.success) {
					installSpinner.succeed(
						chalk.green(
							`Icons installed to ${installResult.projectType} project`
						)
					);
					console.log(
						chalk.gray(`  Project: ${chalk.cyan(installResult.projectName)}`)
					);
					installResult.installedPaths.forEach(p => {
						console.log(chalk.gray(`  Location: ${chalk.cyan(p)}`));
					});
				} else {
					installSpinner.warn(chalk.yellow(installResult.message));
				}
			} catch (error) {
				installSpinner.fail(chalk.red(`Installation failed: ${error.message}`));
			}
			console.log();
		}

		// Step 10: Show completion box
		console.log(createCompletionBox(results));

		process.exit(0);
	} catch (error) {
		generateSpinner.fail(chalk.red("Generation failed"));
		console.error(chalk.red("\n❌ Error: " + error.message + "\n"));
		process.exit(1);
	}
}
