# API Automation Framework

## Overview

This directory contains API automation tests for the Ella API assessment.

The framework uses **Playwright Test** to validate critical API workflows, validation rules, and negative scenarios.

## Framework

- **Tool:** Playwright Test
- **Test Type:** API Testing
- **API Base URL:** `http://localhost:4000`
- **Test File:** `api.spec.ts`
- **Configuration:** `playwright.config.ts`

## Why Playwright

Playwright was selected for API automation because it provides:

- Built-in API request support
- Built-in assertions
- Clear test execution and reporting
- Reliable asynchronous testing
- Easy integration with CI/CD pipelines
- Support for extending the framework to end-to-end testing

## Test Coverage

The current automation suite contains **6 tests**.

### Critical Purchase Flow

The test validates the complete API workflow:

1. Create a user
2. Create a product
3. Create a transaction
4. Retrieve the created transaction
5. Verify the returned transaction data

### User Validation

The tests verify:

1. Missing required user fields return HTTP `400`
2. Duplicate user email returns HTTP `409`

### Transaction Validation

The tests verify:

1. A transaction with a non-existent user returns HTTP `404`
2. A transaction with user ID `0` returns HTTP `404`
3. A transaction with a negative user ID returns HTTP `404`

## Project Structure

```text
automation-framework/
├── api.spec.ts
├── playwright.config.ts
└── README.md