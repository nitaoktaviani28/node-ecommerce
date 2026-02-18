/**
 * observability/profiling.js
 * 
 * Equivalent to: observability/profiling.go
 * 
 * Pyroscope profiling setup.
 * Enables continuous CPU and memory profiling.
 */

const Pyroscope = require('@pyroscope/nodejs');
const { getEnv } = require('./env');

/**
 * Initialize Pyroscope profiling.
 * Equivalent to initProfiling() in Go.
 * 
 * Enables:
 * - Wall profiling
 * - CPU time collection
 */
function initProfiling() {
    try {
        Pyroscope.init({
            appName: getEnv('PYROSCOPE_APPLICATION_NAME', 'node-ecommerce'),
            serverAddress: getEnv(
                'PYROSCOPE_SERVER_ADDRESS',
                'http://pyroscope-distributor.monitoring.svc.cluster.local:4040'
            ),
        });

        Pyroscope.start();
        console.log('✅ Pyroscope profiling initialized');
    } catch (error) {
        console.error('❌ Profiling init failed:', error.message);
    }
}

module.exports = { initProfiling };
