/**
 * Simple Test - Verify Jest Setup
 */

import { describe, test, expect } from "@jest/globals";
import { getSupportedPlatforms } from "../index.js";

describe("Basic Functionality", () => {
	test("should import module correctly", () => {
		expect(true).toBe(true);
	});

	test("should get supported platforms", () => {
		const platforms = getSupportedPlatforms();
		expect(Array.isArray(platforms)).toBe(true);
		expect(platforms.length).toBeGreaterThan(0);
		expect(platforms).toContain("ios");
		expect(platforms).toContain("android");
	});
});
