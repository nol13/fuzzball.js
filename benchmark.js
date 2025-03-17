/**
 * Comprehensive benchmark for fuzzball
 */
const fuzz = require('./fuzzball');

// Utility to measure execution time
function measureTime(fn, iterations = 1) {
  const start = process.hrtime.bigint();
  
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  
  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1000000;
  
  return {
    totalMs: durationMs,
    avgMs: durationMs / iterations
  };
}

// Generate test data
function generateChoices(size) {
  const choices = [];
  for (let i = 0; i < size; i++) {
    choices.push(`Test string number ${i} with some additional words like apple banana orange grape melon`);
  }
  return choices;
}

// Generate test data with emoji and astral characters
function generateAstralChoices(size) {
  const choices = [];
  const emojis = ['😀', '🚀', '🌍', '🎉', '🔥', '💯', '🍎', '🍌', '🍊', '🍇', '🍈'];
  
  for (let i = 0; i < size; i++) {
    // Insert random emojis into the string
    const emojiCount = 2 + Math.floor(Math.random() * 4); // 2-5 emojis
    let emojiString = '';
    
    for (let j = 0; j < emojiCount; j++) {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      emojiString += randomEmoji + ' ';
    }
    
    choices.push(`Test string ${emojiString}number ${i} with some additional words like apple banana orange grape melon`);
  }
  return choices;
}

// Generate longer test data
function generateLongChoices(size) {
  const choices = [];
  for (let i = 0; i < size; i++) {
    choices.push(`This is a much longer test string number ${i} with significantly more text content for testing performance with lengthy strings. It contains various words such as apple banana cherry date elderberry fig grape honeydew imbe jackfruit kiwi lemon mango nectarine orange papaya quince raspberry strawberry tangerine ugli vanilla watermelon xigua yellowfruit zucchini and many other random terms to increase the overall length of each item.`);
  }
  return choices;
}

// Benchmark configuration
const iterations = 20;
const datasetSize = 1000;
const astralDatasetSize = 500; // Smaller size for astral tests to keep runtime reasonable

// Query strings for testing
const queries = [
  'apple banana',
  'test string with words',
  'orange grape',
  'something completely different',
  'melon test string'
];

// Astral queries - include some with emojis
const astralQueries = [
  'apple 🍎 banana 🍌',
  'test string',
  '🔥 orange grape',
];

// All available scorers to benchmark
const scorers = [
  { name: 'ratio', fn: fuzz.ratio },
  { name: 'token_set_ratio', fn: fuzz.token_set_ratio },
  { name: 'token_sort_ratio', fn: fuzz.token_sort_ratio },
  { name: 'partial_token_set_ratio', fn: fuzz.partial_token_set_ratio },
  { name: 'partial_token_sort_ratio', fn: fuzz.partial_token_sort_ratio },
  { name: 'token_similarity_sort_ratio', fn: fuzz.token_similarity_sort_ratio }
];

console.log('FUZZBALL PERFORMANCE BENCHMARK');
console.log('=============================');
console.log(`Configuration: ${iterations} iterations, ${datasetSize} items in dataset`);

// Generate dataset
const choices = generateChoices(datasetSize);

// Section 1: Test all scorers with all queries
console.log('\n1. PERFORMANCE BY SCORER');
console.log('------------------------');

// Store all results for summary
const allResults = {};

// For each scorer
for (const scorer of scorers) {
  console.log(`\nTesting with scorer: ${scorer.name}`);
  console.log('------------------------------------');
  
  const scorerResults = [];
  
  // For each query
  for (const query of queries) {
    const result = measureTime(() => {
      fuzz.extract(query, choices, { scorer: scorer.fn, limit: 5 });
    }, iterations);
    
    scorerResults.push(result.avgMs);
    console.log(`Query "${query}": ${result.avgMs.toFixed(4)} ms avg per call`);
  }
  
  // Calculate and display average for this scorer
  const average = scorerResults.reduce((sum, time) => sum + time, 0) / scorerResults.length;
  console.log(`Average for ${scorer.name}: ${average.toFixed(4)} ms`);
  
  allResults[scorer.name] = average;
}

// Section 2: Scaling test with different dataset sizes
console.log('\n2. SCALING BEHAVIOR TEST');
console.log('------------------------');
console.log('Testing how performance scales with dataset size using token_set_ratio:');

const sizes = [10, 50, 100, 500, 1000];

for (const size of sizes) {
  const smallerChoices = generateChoices(size);
  
  const result = measureTime(() => {
    fuzz.extract('apple banana', smallerChoices, { scorer: fuzz.token_set_ratio, limit: 5 });
  }, iterations);
  
  console.log(`Array size ${size}: ${result.avgMs.toFixed(4)} ms avg per call`);
}

// Section 3: Long string test
console.log('\n3. LONG STRING TEST');
console.log('-------------------');
console.log('Testing performance with much longer strings (250+ characters each):');

// Generate long string dataset - smaller size to keep test duration reasonable
const longChoices = generateLongChoices(500);

// Test a subset of scorers on long strings
const longStringScorers = [
  { name: 'ratio', fn: fuzz.ratio },
  { name: 'token_set_ratio', fn: fuzz.token_set_ratio },
  { name: 'token_sort_ratio', fn: fuzz.token_sort_ratio },
  { name: 'token_similarity_sort_ratio', fn: fuzz.token_similarity_sort_ratio }
];

const longStringResults = {};

// Test each scorer with long strings
for (const scorer of longStringScorers) {
  console.log(`\nLong string test with ${scorer.name}:`);
  
  // Use the first two queries for brevity
  const testQueries = queries.slice(0, 2);
  const queryResults = [];
  
  for (const query of testQueries) {
    const result = measureTime(() => {
      fuzz.extract(query, longChoices, { scorer: scorer.fn, limit: 5 });
    }, iterations);
    
    queryResults.push(result.avgMs);
    console.log(`Query "${query}": ${result.avgMs.toFixed(4)} ms avg per call`);
  }
  
  const average = queryResults.reduce((sum, time) => sum + time, 0) / queryResults.length;
  console.log(`Average for ${scorer.name} with long strings: ${average.toFixed(4)} ms`);
  
  longStringResults[scorer.name] = average;
}

// Compare with regular string performance
console.log('\nPerformance comparison - Regular vs Long strings:');
console.log('--------------------------------------------------');
console.log('Scorer                     | Regular (ms) | Long (ms) | Ratio');
console.log('------------------------------------------------------------');

for (const scorer of longStringScorers) {
  const regularTime = allResults[scorer.name];
  const longTime = longStringResults[scorer.name];
  const ratio = (longTime / regularTime).toFixed(2);
  
  console.log(`${scorer.name.padEnd(26)} | ${regularTime.toFixed(4).padEnd(12)} | ${longTime.toFixed(4).padEnd(9)} | ${ratio}x slower`);
}

// Section 4: Astral support test
console.log('\n4. ASTRAL SUPPORT TEST');
console.log('---------------------');
console.log('Testing performance with astral option enabled (emoji support):');

// Generate astral dataset
const astralChoices = generateAstralChoices(astralDatasetSize);

// Test subset of scorers for astral performance
const astralScorers = [
  { name: 'ratio', fn: fuzz.ratio },
  { name: 'token_set_ratio', fn: fuzz.token_set_ratio },
  { name: 'token_sort_ratio', fn: fuzz.token_sort_ratio },
  { name: 'token_similarity_sort_ratio', fn: fuzz.token_similarity_sort_ratio }
];

// First test without astral option
console.log('\nWithout astral option (baseline):');
const regularAstralResults = {};

for (const scorer of astralScorers) {
  const results = [];
  
  for (const query of astralQueries) {
    const result = measureTime(() => {
      fuzz.extract(query, astralChoices, { 
        scorer: scorer.fn, 
        limit: 5 
      });
    }, iterations);
    
    results.push(result.avgMs);
  }
  
  const average = results.reduce((sum, time) => sum + time, 0) / results.length;
  console.log(`${scorer.name}: ${average.toFixed(4)} ms avg`);
  regularAstralResults[scorer.name] = average;
}

// Then test with astral option enabled
console.log('\nWith astral option enabled:');
const astralOptionResults = {};

for (const scorer of astralScorers) {
  const results = [];
  
  for (const query of astralQueries) {
    const result = measureTime(() => {
      fuzz.extract(query, astralChoices, { 
        scorer: scorer.fn, 
        limit: 5,
        astral: true 
      });
    }, iterations);
    
    results.push(result.avgMs);
  }
  
  const average = results.reduce((sum, time) => sum + time, 0) / results.length;
  console.log(`${scorer.name}: ${average.toFixed(4)} ms avg`);
  astralOptionResults[scorer.name] = average;
}

// Compare astral vs non-astral performance
console.log('\nPerformance comparison - With vs Without astral option:');
console.log('---------------------------------------------------------');
console.log('Scorer                     | Without (ms) | With (ms) | Impact');
console.log('----------------------------------------------------------');

for (const scorer of astralScorers) {
  const withoutAstral = regularAstralResults[scorer.name];
  const withAstral = astralOptionResults[scorer.name];
  const ratio = (withAstral / withoutAstral).toFixed(2);
  
  console.log(`${scorer.name.padEnd(26)} | ${withoutAstral.toFixed(4).padEnd(12)} | ${withAstral.toFixed(4).padEnd(9)} | ${ratio}x slower`);
}

// Section 5: Summary of results
console.log('\n5. PERFORMANCE SUMMARY');
console.log('---------------------');
console.log('Scorer                     | Average time (ms)');
console.log('------------------------------------------');

// Sort by performance (fastest first)
const sortedScorers = Object.entries(allResults)
  .sort((a, b) => a[1] - b[1])
  .map(([name, time]) => ({ name, time }));

for (const { name, time } of sortedScorers) {
  console.log(`${name.padEnd(26)} | ${time.toFixed(4)} ms`);
}

console.log('\nBenchmark complete!'); 