// benchmark.js
// Measures and compares API response times: Uncached vs. Cached

const BASE_URL = process.env.BASE_URL || "http://localhost:5001";

async function measureRequest(url) {
  const start = performance.now();
  const res = await fetch(url);
  const data = await res.json();
  const duration = performance.now() - start;
  return {
    status: res.status,
    cacheHeader: res.headers.get("x-cache") || "NONE",
    timeMs: parseFloat(duration.toFixed(2)),
    itemCount: Array.isArray(data) ? data.length : 1
  };
}

async function runBenchmark() {
  console.log("====================================================");
  console.log(" PRACTICAL 09: CACHED VS UNCACHED BENCHMARK TEST");
  console.log(" Target URL:", BASE_URL);
  console.log("====================================================\n");

  // Step 1: Ensure server is reachable
  try {
    await fetch(`${BASE_URL}/`);
  } catch (err) {
    console.error("Error: Server not running at", BASE_URL);
    console.error("Please run 'npm run dev' first before running the benchmark.");
    process.exit(1);
  }

  // Clear cache first
  await fetch(`${BASE_URL}/tasks/debug/cache-clear`, { method: "POST" });

  const numSamples = 5;
  const uncachedReadings = [];
  const cachedReadings = [];

  console.log(`[1] Running ${numSamples} UNCACHED requests (Direct MongoDB query)...`);
  for (let i = 1; i <= numSamples; i++) {
    const result = await measureRequest(`${BASE_URL}/tasks?nocache=true`);
    uncachedReadings.push(result.timeMs);
    console.log(`  Sample ${i}: ${result.timeMs} ms [X-Cache: ${result.cacheHeader}]`);
  }

  console.log(`\n[2] Warming up cache (Initial request to populate node-cache)...`);
  const initial = await measureRequest(`${BASE_URL}/tasks`);
  console.log(`  Initial MISS: ${initial.timeMs} ms [X-Cache: ${initial.cacheHeader}]`);

  console.log(`\n[3] Running ${numSamples} CACHED requests (Served from in-memory cache)...`);
  for (let i = 1; i <= numSamples; i++) {
    const result = await measureRequest(`${BASE_URL}/tasks`);
    cachedReadings.push(result.timeMs);
    console.log(`  Sample ${i}: ${result.timeMs} ms [X-Cache: ${result.cacheHeader}]`);
  }

  // Get debug stats
  const statsRes = await fetch(`${BASE_URL}/debug/cache-stats`);
  const stats = await statsRes.json();

  // Calculate statistics
  const avgUncached = uncachedReadings.reduce((a, b) => a + b, 0) / uncachedReadings.length;
  const avgCached = cachedReadings.reduce((a, b) => a + b, 0) / cachedReadings.length;
  const speedup = (avgUncached / avgCached).toFixed(1);
  const reductionPercent = (((avgUncached - avgCached) / avgUncached) * 100).toFixed(1);

  console.log("\n====================================================");
  console.log(" BENCHMARK RESULTS TABLE (FOR LAB JOURNAL / REPORT)");
  console.log("====================================================\n");

  console.log("| Request Sample | Uncached (MongoDB) | Cached (node-cache) | Improvement |");
  console.log("|:--------------:|:------------------:|:-------------------:|:-----------:|");
  for (let i = 0; i < numSamples; i++) {
    const diff = (uncachedReadings[i] - cachedReadings[i]).toFixed(2);
    console.log(
      `| Sample ${i + 1}       | ${uncachedReadings[i].toFixed(2)} ms           | ${cachedReadings[i].toFixed(2)} ms           | -${diff} ms |`
    );
  }
  console.log("|:--------------:|:------------------:|:-------------------:|:-----------:|");
  console.log(
    `| **Average**    | **${avgUncached.toFixed(2)} ms**     | **${avgCached.toFixed(2)} ms**      | **${speedup}x faster (${reductionPercent}% drop)** |`
  );

  console.log("\nCache Hit/Miss Stats:", stats);
  console.log("====================================================");
}

runBenchmark();
