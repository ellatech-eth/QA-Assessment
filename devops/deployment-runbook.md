# Deployment Runbook

## 1. Overview

This runbook describes how to build, deploy, verify, troubleshoot, and roll back the Ella API using Docker Compose.

The application consists of:

- NestJS API
- PostgreSQL 16 database
- Docker Compose
- GitHub Actions CI

## 2. Prerequisites

Before deployment, ensure the following are available:

- Docker Desktop
- Docker Compose
- Git
- Node.js 20+ for local development
- A configured `.env` file

Verify Docker:

`docker --version`

Verify Docker Compose:

`docker compose version`

## 3. Environment Configuration

Create `.env` from `.env.example`.

Required variables:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DATABASE`

For Docker Compose, the API service overrides `DB_HOST` to `db` so that the API connects to the PostgreSQL container.

Never commit `.env` or production secrets to source control.

## 4. Pre-Deployment Checks

Run the following checks before deployment:

`npm ci`

`npx eslint .`

`npm run build`

`npm test`

All checks should pass before deployment.

## 5. Docker Deployment

Stop any existing Compose stack:

`docker compose down`

Build and start the complete stack:

`docker compose up --build -d`

Check service status:

`docker compose ps`

Expected services:

- `shop-api`
- `shop-db`

The PostgreSQL container should report `healthy`.

## 6. Database Verification

Check PostgreSQL logs:

`docker compose logs db`

The database should start successfully and accept connections.

If migrations are required, run the project's migration command before starting production traffic.

## 7. API Verification

Check the application logs:

`docker compose logs api`

Verify the health endpoint:

`Invoke-RestMethod http://localhost:4000/health | ConvertTo-Json`

Expected result:

- HTTP 200
- `status` = `ok`
- `service` = `ella-api`

Verify a functional API endpoint:

`Invoke-RestMethod http://localhost:4000/products`

The endpoint should return HTTP 200.

## 8. Deployment Smoke Test

After deployment, verify:

1. API container is running.
2. PostgreSQL container is healthy.
3. `/health` returns HTTP 200.
4. `/products` returns HTTP 200.
5. No critical errors appear in API logs.

## 9. Troubleshooting

### API cannot connect to PostgreSQL

Check:

`docker compose ps`

Then inspect database logs:

`docker compose logs db`

Verify that the API uses:

`DB_HOST=db`

inside Docker Compose.

### Port 5432 is already in use

Check:

`netstat -ano | findstr :5432`

Identify the process using the port and stop the conflicting service if appropriate.

Alternatively, change the host port mapping in Docker Compose.

### Port 4000 is already in use

Check:

`netstat -ano | findstr :4000`

Stop the conflicting process or change the API port.

### API health endpoint returns 404

Confirm the latest application code is running and restart the API container:

`docker compose up --build -d`

Then test:

`Invoke-RestMethod http://localhost:4000/health | ConvertTo-Json`

### Container fails during startup

Inspect logs:

`docker compose logs api`

Check that:

- environment variables are configured
- PostgreSQL is healthy
- the application build completed successfully
- database configuration is correct

## 10. Rollback

If a deployment introduces a blocking issue:

1. Stop the current deployment:

`docker compose down`

2. Switch to the last known-good Git commit.

3. Rebuild the application:

`docker compose up --build -d`

4. Verify:

`docker compose ps`

5. Run the health check:

`Invoke-RestMethod http://localhost:4000/health | ConvertTo-Json`

6. Run the API smoke test:

`Invoke-RestMethod http://localhost:4000/products`

## 11. Post-Deployment Monitoring

The `/health` endpoint provides a lightweight liveness check.

It can be used by:

- container health checks
- load balancers
- uptime monitoring
- deployment smoke tests

The current endpoint does not independently verify database connectivity.

For production deployments, a deeper readiness check and centralized logging/monitoring should be added.

## 12. Deployment Checklist

Before deployment:

- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Lint passes
- [ ] Build passes
- [ ] Unit tests pass
- [ ] Docker image builds successfully

After deployment:

- [ ] PostgreSQL is healthy
- [ ] API container is running
- [ ] `/health` returns HTTP 200
- [ ] `/products` returns HTTP 200
- [ ] No critical API errors
- [ ] Deployment smoke test passes

## 13. Current Verification Status

The Docker Compose deployment was successfully tested.

Verified:

- Docker image built successfully
- PostgreSQL 16 started successfully
- PostgreSQL health check passed
- NestJS API started successfully
- `/health` returned HTTP 200
- `/products` returned HTTP 200

The deployment process is therefore verified locally.