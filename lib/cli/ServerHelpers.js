/**
 * ServerHelpers - Functions for HTTP server management
 *
 * This module contains helper functions for starting and managing
 * the HTTP API server.
 */

import { HttpServer } from "../server/HttpServer.js";

/**
 * Start Express server with icon generation endpoint
 * Uses the refactored HttpServer class that follows SOLID principles
 *
 * @param {number} port - Port number to listen on
 * @returns {Promise<void>}
 */
export async function startServer(port = 3000) {
	const server = new HttpServer({ port });
	await server.start();
}
