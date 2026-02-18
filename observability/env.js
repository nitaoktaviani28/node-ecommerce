/**
 * observability/env.js
 * 
 * Equivalent to: observability/env.go
 * 
 * Environment variable helper functions.
 * Provides getEnv() utility like Go version.
 */

/**
 * Get environment variable or return default value.
 * Equivalent to getEnv() in Go.
 * 
 * @param {string} key - Environment variable name
 * @param {string} defaultValue - Default value if not found
 * @returns {string} Environment variable value or default
 */
function getEnv(key, defaultValue = '') {
    return process.env[key] || defaultValue;
}

module.exports = { getEnv };
