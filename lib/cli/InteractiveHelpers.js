/**
 * InteractiveHelpers - Functions for interactive CLI mode
 *
 * This module handles the interactive prompts and user input
 * for the CLI's interactive mode.
 */

import chalk from "chalk";
import boxen from "boxen";
import inquirer from "inquirer";
import { existsSync } from "fs";
import { Platform } from "../core/ImageProcessor";

/**
 * Run interactive mode with prompts
 * @param {Function} generateCallback - Callback function to generate icons with options
 * @returns {Promise<void>}
 */
export async function runInteractiveMode(generateCallback) {
	console.log(
		boxen(
			chalk.bold.magenta("🎨  Interactive Icon Generator\n\n") +
				chalk.gray("Step-by-step wizard for generating mobile app icons"),
			{
				padding: 1,
				margin: 1,
				borderStyle: "double",
				borderColor: "magenta",
				textAlignment: "center",
			}
		)
	);

	const answers = await inquirer.prompt([
		{
			type: "input",
			name: "input",
			message: "Enter the path to your source image:",
			validate: input => {
				if (!input) return "Please enter a file path";
				if (!existsSync(input)) return "File does not exist";
				return true;
			},
		},
		{
			type: "input",
			name: "output",
			message: "Enter the output directory:",
			default: "./output",
		},
		{
			type: "list",
			name: "platform",
			message: "Select target platform:",
			choices: [
				{ name: "Both iOS and Android", value: "all" },
				{ name: "iOS", value: "ios" },
				{ name: "Android", value: "android" },
			],
			default: Platform.All,
		},
		{
			type: "confirm",
			name: "zip",
			message: "Create a ZIP archive?",
			default: false,
		},
		{
			type: "confirm",
			name: "force",
			message: "Overwrite existing files?",
			default: false,
		},
	]);

	console.log();
	await generateCallback({
		input: answers.input,
		out: answers.output,
		platform: answers.platform,
		zip: answers.zip,
		force: answers.force,
	});
}
