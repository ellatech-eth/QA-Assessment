# Ella API QA Assessment Submission

## Overview

This submission covers QA and DevOps validation of the Ella API, including exploratory testing, manual test cases, unit testing, API automation, Postman testing, performance testing, CI/CD, Docker, environment configuration, health checks, and deployment documentation.

**Application:** Ella API  
**Technology:** NestJS, TypeScript, PostgreSQL  
**API:** `http://localhost:4000`  
**Swagger:** `http://localhost:4000/api`

## Deliverables

### QA

- `qa/test-strategy.md` — Test strategy
- `qa/test-cases.md` — Manual test cases
- `qa/BUGS.md` — Exploratory testing findings and defect report
- `src/users/users.service.spec.ts` — Jest unit tests
- `automation-framework/` — Playwright API automation
- `qa/postman/` — Postman API collection
- `qa/performance-test.js` — k6 performance test
- `qa/performance-results.md` — Performance results

### DevOps

- `.github/workflows/ci.yml` — GitHub Actions CI
- `devops/ci-notes.md` — CI and Docker verification
- `devops/code-review-guidelines.md` — Code review and mentorship guidelines
- `devops/environment-notes.md` — Environment configuration
- `devops/health-check.md` — Health endpoint documentation
- `devops/deployment-runbook.md` — Deployment and rollback procedures

## Results

| Area | Result |
|---|---|
| Manual testing | Completed |
| Bug investigation | Completed |
| Unit tests | 6/6 passed |
| Playwright API tests | 6/6 passed |
| Postman | 9/9 requests, 22/22 tests passed |
| k6 performance test | Passed |
| ESLint | Passed |
| TypeScript build | Passed |
| GitHub Actions CI | Configured |
| Docker Compose | Verified |
| Health check | HTTP 200 |
| Deployment runbook | Completed |

## How to Run

### Install dependencies

`npm ci`

### Start the database

`docker start shop-db`

### Start the API

`npm run start:dev`

### Run lint

`npx eslint .`

### Build

`npm run build`

### Run unit tests

`npm test`

### Run API automation

`npx playwright test --config=automation-framework/playwright.config.ts`

### Run performance test

`"C:\Program Files\k6\k6.exe" run qa/performance-test.js`

### Health check

`Invoke-RestMethod http://localhost:4000/health`

### Docker deployment

`docker compose up --build`

## Key Finding

The main defect identified was duplicate user handling in `UsersService`. The implementation returned an incorrect success response and contained an invalid TypeScript object in the error path.

The issue was corrected to detect the PostgreSQL unique constraint violation and return `409 Conflict` for duplicate email addresses.

## Notes

The k6 test is a local baseline performance test and is not a production capacity benchmark.

The health endpoint is a lightweight liveness check and does not independently verify database connectivity.

Dependency vulnerabilities reported by `npm ci` should be reviewed separately as part of dependency maintenance.