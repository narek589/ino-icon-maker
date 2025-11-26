/**
 * Simple Node.js usage example - Works exactly like CLI
 * 
 * This example shows how to use ino-icon-maker programmatically
 * with the same simple API as the CLI commands.
 * 
 * Usage: node examples/node-simple.js
 */

import { quickGenerate } from 'ino-icon-maker';

async function generateIcons() {
  const inputImage = './test-directory/input/icon.png'; // Your icon file
  const outputDir = './output'; // Output folder

  try {
    console.log('Generating icons...');

    // Method 1: Simple - foreground + background (same as CLI)
    // Works exactly like: ino-icon generate -fg icon.png -bg "#FF5722"
    await quickGenerate({
      foreground: inputImage,
      background: '#111111',
      output: outputDir,
      zip: true,
      fgScale: 1.2 // Optional: zoom in content
    });

    console.log('✓ Success! Icons generated in ./output/');
    console.log('  - iOS: AppIcon.appiconset/');
    console.log('  - Android: android-icons/');
    console.log('  - ZIP: output.zip');

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

// Run it
generateIcons();

