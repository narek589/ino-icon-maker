#!/usr/bin/env node

/**
 * Express.js Integration Example
 *
 * This example shows how to integrate ino-icon-maker
 * into an Express.js API server.
 *
 * Run: node examples/express-integration.js
 * Test: curl -F "file=@icon.png" http://localhost:3001/generate -o icons.zip
 */

import express from "express";
import multer from "multer";
import { quickGenerate } from "../index.js";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { Platform } from "../lib/core/ImageProcessor.js";

const app = express();
const upload = multer({ dest: "uploads/" });

// Health check
app.get("/", (req, res) => {
	res.json({
		service: "Icon Generator API",
		version: "1.0.0",
		endpoints: {
			generate: "POST /generate",
			health: "GET /health",
		},
	});
});

// Health check endpoint
app.get("/health", (req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Icon generation endpoint
app.post("/generate", upload.single("icon"), async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

	const platform = req.query.platform || Platform.All;
	const createZip = req.query.zip !== "false";
	let tempDir = null;

	try {
		console.log(`\n📥 Received request: ${req.file.originalname}`);
		console.log(`   Platform: ${platform}`);
		console.log(`   Size: ${req.file.size} bytes`);

		// Create temporary directory
		tempDir = await mkdtemp(join(tmpdir(), "icons-"));

		// Generate icons
		console.log("   Generating icons...");
		const result = await quickGenerate({
			input: req.file.path,
			output: tempDir,
			platform: platform,
			zip: createZip,
			force: true,
		});

		console.log("   ✅ Generation successful");

		if (createZip) {
			// Send ZIP file
			const zipPath = Array.isArray(result)
				? result[0]?.zipPath
				: result.zipPath;

			if (zipPath) {
				res.download(zipPath, "icons.zip", async err => {
					// Cleanup after sending
					await rm(tempDir, { recursive: true, force: true });
					await rm(req.file.path, { force: true });

					if (err) {
						console.error("   ❌ Error sending file:", err.message);
					} else {
						console.log("   ✅ ZIP file sent successfully");
					}
				});
			} else {
				throw new Error("ZIP file not created");
			}
		} else {
			// Send JSON response
			res.json({
				success: true,
				message: "Icons generated successfully",
				result: result,
			});

			// Cleanup
			await rm(tempDir, { recursive: true, force: true });
			await rm(req.file.path, { force: true });
		}
	} catch (error) {
		console.error("   ❌ Error:", error.message);

		// Cleanup on error
		if (tempDir) {
			await rm(tempDir, { recursive: true, force: true }).catch(() => {});
		}
		await rm(req.file.path, { force: true }).catch(() => {});

		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

// Error handling
app.use((err, req, res, next) => {
	console.error("Server error:", err);
	res.status(500).json({
		success: false,
		error: err.message || "Internal server error",
	});
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log("🚀 Express Icon Generator API");
	console.log(`\n   Server: http://localhost:${PORT}`);
	console.log("\n📋 Endpoints:");
	console.log("   GET  / - Service info");
	console.log("   GET  /health - Health check");
	console.log("   POST /generate - Generate icons");
	console.log("\n📚 Examples:");
	console.log(
		`   curl -F "file=@icon.png" "http://localhost:${PORT}/generate" -o icons.zip`
	);
	console.log(
		`   curl -F "file=@icon.png" "http://localhost:${PORT}/generate?platform=ios" -o ios.zip`
	);
	console.log(
		`   curl -F "file=@icon.png" "http://localhost:${PORT}/generate?zip=false"`
	);
	console.log("\n✅ Server ready!\n");
});
