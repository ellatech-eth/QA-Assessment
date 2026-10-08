# Performance Test Results

## Overview

A basic load test was executed against the Ella API using k6.

- **Tool:** k6 v2.2.0
- **Environment:** Local development
- **Endpoint:** `GET /products`
- **Base URL:** `http://localhost:4000`
- **Maximum Virtual Users:** 20
- **Test Duration:** 40 seconds

## Test Configuration

The test gradually increased the load from 10 to 20 virtual users and then reduced the load back to zero.

Thresholds:

- HTTP request failure rate: less than 1%
- 95th percentile response time: less than 1000 ms

## Results

| Metric | Result |
|---|---:|
| Total HTTP requests | 448 |
| Failed requests | 0 |
| Failure rate | 0.00% |
| Average response time | 13.62 ms |
| Median response time | 11.12 ms |
| p90 response time | 21 ms |
| p95 response time | 25.03 ms |
| Maximum response time | 116.44 ms |
| Requests per second | 10.97 |
| Maximum VUs | 20 |
| Checks | 896 |
| Checks passed | 896 |
| Checks failed | 0 |

## Threshold Results

### HTTP Request Duration

**PASS**

The p95 response time was **25.03 ms**, which is significantly below the configured threshold of **1000 ms**.

### HTTP Request Failure Rate

**PASS**

The failure rate was **0.00%**, below the configured threshold of **1%**.

### Functional Checks

**PASS**

All 896 checks passed:

- HTTP status was 200
- Response contained data

## Conclusion

The `/products` endpoint successfully handled the configured load of up to 20 virtual users during the test.

No failed HTTP requests were observed, and the response time remained well below the configured performance threshold.

This was a baseline local performance test. Additional testing with higher virtual-user counts and a production-like environment would be required to establish production capacity and scalability limits.