/**
 * observability/init.js
 * 
 * Equivalent to: observability/init.go
 * 
 * Single entry point untuk inisialisasi observability.
 * Fungsi Init() dipanggil sekali saat aplikasi startup.
 */

const { initTracing } = require('./tracing');
const { initProfiling } = require('./profiling');

/**
 * Initialize all observability components.
 * Equivalent to Init() in Go.
 * 
 * This is the ONLY function that business logic calls.
 */
function Init() {
    console.log('🔍 Initializing observability...');

    // Initialize tracing (OpenTelemetry → Tempo via Alloy)
    try {
        initTracing();
    } catch (error) {
        console.error('Tracing init failed (non-fatal):', error);
    }

    // Initialize profiling (Pyroscope)
    try {
        initProfiling();
    } catch (error) {
        console.error('Profiling init failed (non-fatal):', error);
    }

    console.log('✅ Observability initialized');
}

module.exports = { Init };
