export default {
	testEnvironment: "node",
	transform: {},
	testMatch: ["**/test/**/*.test.js"],
	collectCoverageFrom: ["lib/**/*.js", "index.js"],
	coveragePathIgnorePatterns: ["/node_modules/"],
	verbose: false,
};
