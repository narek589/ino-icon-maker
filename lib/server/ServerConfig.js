/**
 * ServerConfig - Single Responsibility: Manage server configuration
 *
 * This class centralizes all server configuration management,
 * making it easy to modify settings without touching server logic.
 *
 * @pure - All methods are pure functions that return configuration values
 */

export class ServerConfig {
	/**
	 * Create server configuration with optional overrides
	 * @param {object} options - Configuration options
	 * @param {number} [options.port] - Port number
	 * @param {string} [options.host] - Host address
	 * @param {string} [options.uploadDir] - Upload directory path
	 * @param {number} [options.maxFileSize] - Maximum file size in bytes
	 */
	constructor(options = {}) {
		this.port = options.port || process.env.PORT || 3000;
		this.host = options.host || process.env.HOST || "localhost";
		this.uploadDir =
			options.uploadDir || process.env.UPLOAD_DIR || "/tmp/ios-icon-uploads/";
		this.maxFileSize =
			options.maxFileSize || parseInt(process.env.MAX_FILE_SIZE || "52428800"); // 50MB default
	}

	/**
	 * Get server port
	 * @pure
	 * @returns {number} Port number
	 */
	getPort() {
		return this.port;
	}

	/**
	 * Get server host
	 * @pure
	 * @returns {string} Host address
	 */
	getHost() {
		return this.host;
	}

	/**
	 * Get upload directory path
	 * @pure
	 * @returns {string} Upload directory
	 */
	getUploadDir() {
		return this.uploadDir;
	}

	/**
	 * Get maximum file size
	 * @pure
	 * @returns {number} Max file size in bytes
	 */
	getMaxFileSize() {
		return this.maxFileSize;
	}

	/**
	 * Get allowed MIME types for uploads
	 * @pure
	 * @returns {Array<string>} Array of allowed MIME types
	 */
	getAllowedMimeTypes() {
		return [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/webp",
			"image/avif",
			"image/tiff",
		];
	}

	/**
	 * Get supported image formats (display names)
	 * @pure
	 * @returns {Array<string>} Array of format names
	 */
	getSupportedFormats() {
		return ["jpeg", "jpg", "png", "webp", "avif", "tiff"];
	}

	/**
	 * Get server URL
	 * @pure
	 * @returns {string} Full server URL
	 */
	getServerUrl() {
		return `http://${this.host}:${this.port}`;
	}

	/**
	 * Get configuration summary for display
	 * @pure
	 * @returns {object} Configuration summary
	 */
	toJSON() {
		return {
			port: this.port,
			host: this.host,
			uploadDir: this.uploadDir,
			maxFileSize: this.maxFileSize,
			supportedFormats: this.getSupportedFormats(),
		};
	}
}
