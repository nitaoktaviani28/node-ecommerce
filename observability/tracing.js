/**
 * observability/tracing.js
 * 
 * Equivalent to: observability/tracing.go
 * 
 * OpenTelemetry tracing setup.
 * Exports traces via OTLP HTTP to Grafana Tempo through Alloy.
 */

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { getEnv } = require('./env');

let sdk;

/**
 * Initialize OpenTelemetry tracing.
 * Equivalent to initTracing() in Go.
 * 
 * Auto-instruments:
 * - HTTP server
 * - Express
 * - PostgreSQL (pg)
 */
function initTracing() {
    const otlpEndpoint = getEnv(
        'OTEL_EXPORTER_OTLP_ENDPOINT',
        'http://alloy.monitoring.svc.cluster.local:4318'
    );

    const traceExporter = new OTLPTraceExporter({
        url: `${otlpEndpoint}/v1/traces`,
    });

    const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: getEnv('OTEL_SERVICE_NAME', 'node-ecommerce'),
    });

    sdk = new NodeSDK({
        resource,
        traceExporter,
        instrumentations: [
            getNodeAutoInstrumentations({
                '@opentelemetry/instrumentation-http': { enabled: true },
                '@opentelemetry/instrumentation-express': { enabled: true },
                '@opentelemetry/instrumentation-pg': { enabled: true },
            }),
        ],
    });

    sdk.start();
    console.log(`✅ Tracing initialized, sending to: ${otlpEndpoint}`);
}

/**
 * Shutdown tracing gracefully.
 */
function shutdownTracing() {
    if (sdk) {
        return sdk.shutdown();
    }
}

module.exports = { initTracing, shutdownTracing };
