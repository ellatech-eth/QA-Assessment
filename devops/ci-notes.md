# DevOps and CI Notes

## 1. GitHub Actions CI

A GitHub Actions workflow was added at `.github/workflows/ci.yml`.

The workflow runs on pushes and pull requests targeting `main` or `master`.

### CI stages

1. Checkout repository
2. Set up Node.js 20
3. Install dependencies with `npm ci`
4. Run ESLint
5. Build the NestJS application
6. Run Jest unit tests

### Local verification

The same CI commands were executed locally:

- `npm ci` → Passed
- `npx eslint .` → Passed
- `npm run build` → Passed
- `npm test` → Passed, 6/6 tests

## 2. Docker Compose Verification

The production-style Docker Compose stack was tested with:

`docker compose up --build`

The API and PostgreSQL services started successfully.

### Results

- API image built successfully
- PostgreSQL 16 started successfully
- PostgreSQL health check passed
- API container started successfully
- API exposed on port 4000
- PostgreSQL exposed on port 5432
- `GET /products` returned HTTP 200

The stack was also verified with:

`docker compose ps`

Both `shop-api` and `shop-db` were running, with `shop-db` reporting healthy.

## 3. Docker Findings

### Finding 1: Obsolete Compose version field

`docker-compose.dev.yml` contains:

`version: '3.9'`

Modern Docker Compose reports this field as obsolete and ignores it.

**Recommendation:** Remove the `version` field from the development Compose file.

### Finding 2: Dependency installation in Dockerfile

The Dockerfile uses `npm install --legacy-peer-deps`.

Because the repository contains a `package-lock.json`, `npm ci` would provide more reproducible dependency installation.

**Recommendation:** Use `npm ci --legacy-peer-deps` where compatible with the project's dependency requirements.

### Finding 3: Docker build duration

The Docker image build completed successfully, but dependency installation took most of the build time.

The observed build took approximately 8.7 minutes.

The main contributors were the dependency installation steps in the builder stage.

**Recommendation:** Optimize dependency installation and Docker layer caching if build speed becomes a concern.

## 4. Current Status

The Docker Compose stack is functional and the API is reachable.

The findings above are documented as improvement opportunities rather than blocking deployment failures.