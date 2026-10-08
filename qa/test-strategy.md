# QA Test Strategy

## 1. Overview

This document defines the test strategy for the Ella API assessment.

The goal is to verify that the API is functionally correct, handles invalid inputs appropriately, maintains expected behavior across its core modules, and performs reliably under basic load.

The testing scope covers the Users, Products, and Transactions modules.

## 2. Testing Objectives

The main objectives are to:

- Verify the main API workflows and business functionality.
- Validate positive, negative, and edge-case scenarios.
- Identify and document defects with reproducible evidence.
- Verify validation and error-handling behavior.
- Automate critical API workflows.
- Execute unit tests for service-level logic.
- Perform baseline API performance testing.
- Provide repeatable test coverage that can be integrated into CI/CD.

## 3. Scope

### In Scope

The following API modules are covered:

- Users
- Products
- Transactions

Testing includes:

- Create operations
- Retrieve operations
- Update operations
- Input validation
- Invalid identifiers
- Duplicate data handling
- Error responses
- Critical transaction workflow
- API automation
- Unit testing
- Baseline performance testing

### Out of Scope

The following areas are outside the current assessment scope:

- Production infrastructure monitoring
- Security penetration testing
- Large-scale distributed load testing
- Browser UI testing
- Third-party production integrations
- Long-duration endurance testing

## 4. Test Levels

### Unit Testing

Jest is used for service-level unit testing.

The UsersService is tested with mocked repository dependencies to verify:

- Successful user creation
- Duplicate email handling
- User retrieval
- Missing-user handling
- User updates
- Missing-user update handling

Current result:

- 6 tests passed
- 0 tests failed

### API Functional Testing

API behavior is tested through Swagger and automated API requests.

The following are covered:

- Successful requests
- Validation failures
- Not-found scenarios
- Duplicate email handling
- Malformed input
- Transaction creation
- Transaction retrieval

### API Automation

Playwright Test is used for API automation.

The critical automated workflow covers:

1. Create a user
2. Create a product
3. Create a transaction
4. Retrieve the transaction
5. Verify the transaction response

Additional automated validation tests cover invalid and duplicate data.

Current result:

- 6 tests passed
- 0 tests failed

### Performance Testing

k6 is used for baseline load testing.

The current performance test targets:

`GET /products`

The test runs with up to 20 virtual users over approximately 40 seconds.

Configured thresholds:

- HTTP request failure rate below 1%
- p95 response time below 1000 ms

Actual result:

- 448 HTTP requests
- 0 failed requests
- 0.00% failure rate
- 13.62 ms average response time
- 25.03 ms p95 response time
- 116.44 ms maximum response time

## 5. Test Types

### Functional Testing

Verifies that API endpoints behave according to their expected functionality.

### Negative Testing

Verifies that invalid requests return appropriate HTTP status codes and error messages.

Examples include:

- Missing required fields
- Invalid user IDs
- Duplicate email addresses
- Malformed JSON

### Edge-Case Testing

Tests boundary and unusual input conditions such as:

- User ID `0`
- Negative user IDs
- Repeated transaction payloads

### Regression Testing

After defects are fixed, the affected functionality is retested to confirm the fix and ensure existing functionality remains stable.

### Performance Testing

Measures basic response time, throughput, request failures, and behavior under concurrent virtual-user load.

## 6. Test Environment

### Application

- NestJS API
- Node.js
- TypeScript
- PostgreSQL

### Database

PostgreSQL is running through Docker Compose.

### API

Local API base URL:

`http://localhost:4000`

Swagger documentation:

`http://localhost:4000/api`

### Testing Tools

- Jest
- Playwright Test
- k6
- Swagger UI
- ESLint
- TypeScript compiler

## 7. Test Data Strategy

Test data should be isolated where possible to reduce conflicts between test runs.

For automated tests, unique email addresses and product names are generated using timestamps.

Example:

`qa_<timestamp>@example.com`

This prevents duplicate-data conflicts between repeated test executions.

Test data should represent:

- Valid users
- Valid products
- Valid transactions
- Invalid identifiers
- Missing required fields
- Duplicate user emails

## 8. Defect Management

Defects are documented with:

- Bug ID
- Title
- Severity
- Module
- Description
- Preconditions
- Steps to reproduce
- Expected result
- Actual result
- Root cause
- Evidence
- Resolution
- Verification result

The identified UsersService compilation and duplicate-email handling issue was documented in `BUGS.md`.

## 9. Risk-Based Testing

Testing priority is based on business impact.

### High Priority

- User creation
- Product creation
- Transaction creation
- Transaction retrieval
- Duplicate user handling
- Database-related failures

### Medium Priority

- User and product retrieval
- User and product updates
- Validation scenarios

### Lower Priority

- Additional edge cases
- Extended performance scenarios
- Non-critical response formatting

The critical purchase flow receives additional automated coverage because transaction functionality depends on successful user and product creation.

## 10. Entry Criteria

Testing can begin when:

- Dependencies are installed.
- Environment configuration is available.
- PostgreSQL is running.
- Database connectivity is confirmed.
- The API starts successfully.
- Required test tools are installed.

## 11. Exit Criteria

Testing is considered complete when:

- Planned functional scenarios have been executed.
- Critical defects are resolved or documented.
- Unit tests pass.
- API automation tests pass.
- Performance thresholds are evaluated.
- Test evidence is recorded.
- Final verification is completed.

## 12. Automation Strategy

The automation strategy focuses on high-value and repeatable scenarios.

Playwright is used for API-level functional automation because it provides built-in HTTP request support and assertions.

The automation suite currently covers:

- Critical purchase flow
- User validation
- Duplicate email handling
- Transaction validation

The suite can be extended with:

- Product validation
- Additional transaction scenarios
- Authentication scenarios if authentication is introduced
- Database verification where appropriate
- CI/CD execution

## 13. CI/CD Integration

The automated test suite should be executed as part of the CI pipeline.

A recommended pipeline is:

1. Install dependencies
2. Run linting
3. Build the application
4. Run unit tests
5. Start required services
6. Run API automation
7. Publish test results
8. Fail the pipeline when critical tests fail

Performance testing can be executed separately from the standard CI pipeline because load tests may require additional resources and execution time.

## 14. Known Limitations

The current performance test is a baseline local test and should not be treated as a production capacity benchmark.

The test uses only 20 virtual users and targets a single read endpoint.

Additional performance testing would be required to evaluate:

- Higher concurrency
- Sustained load
- Stress limits
- Database performance
- Resource utilization
- Production-like infrastructure

## 15. Overall Test Approach

The overall strategy combines:

- Manual exploratory testing
- Functional API testing
- Negative and edge-case testing
- Unit testing
- API automation
- Performance testing
- Defect investigation and regression testing

This layered approach provides coverage from individual service logic through complete API workflows while keeping the most important scenarios repeatable through automation.