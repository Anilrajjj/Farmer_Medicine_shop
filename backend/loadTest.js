const http = require('http');

const CONCURRENT_REQUESTS = 50;
const URL = 'http://127.0.0.1:5001/api/products'; // Make sure this matches backend port

async function testConcurrency() {
    console.log(`Starting ${CONCURRENT_REQUESTS} parallel requests to ${URL}...`);
    const startTime = Date.now();

    const fetchProduct = () => {
        return new Promise((resolve) => {
            const req = http.get(URL, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({ status: res.statusCode, size: data.length });
                });
            });
            req.on('error', (err) => resolve({ status: 'ERROR', error: err.message }));
        });
    };

    const requests = Array.from({ length: CONCURRENT_REQUESTS }, fetchProduct);
    const results = await Promise.all(requests);

    const timeTaken = Date.now() - startTime;

    // Analyze results
    const successes = results.filter(r => r.status === 200).length;
    const failures = results.filter(r => r.status !== 200);

    console.log(`\n--- Test Complete in ${timeTaken}ms ---`);
    console.log(`Successful (200 OK): ${successes}/${CONCURRENT_REQUESTS}`);
    console.log(`Failures: ${failures.length}`);
    if (failures.length > 0) {
        console.log('Sample Error:', failures[0]);
    }
}

testConcurrency();
