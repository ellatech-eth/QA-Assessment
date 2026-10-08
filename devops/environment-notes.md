# Environment Configuration

## Overview

The application uses environment variables for runtime configuration.

The repository includes `.env.example` as a safe template. The actual `.env` file is excluded from Git through `.gitignore` and must not be committed.

## Environments

### Development

Development uses a local `.env` file based on `.env.example`.

Typical configuration:

- Application port: `4000`
- Database host: `localhost`
- PostgreSQL port: `5432`
- Database: `ella`

When using Docker Compose, the API container receives `DB_HOST=db` because the PostgreSQL service is named `db`.

### Testing

Automated unit tests mock the database repository and do not require a live PostgreSQL database.

API and Playwright tests require the application to be running and use the configured API base URL.

Test-specific credentials and secrets should be supplied through environment variables or CI secrets rather than committed files.

### Staging

Staging should use a dedicated PostgreSQL database and separate credentials from development and production.

Recommended configuration:

- Dedicated database
- Dedicated database credentials
- Staging API URL
- Secrets stored in the deployment platform or CI/CD secret store
- No production credentials reused

### Production

Production must use production-specific configuration and secrets.

Sensitive values such as database passwords must not be committed to Git.

Recommended production configuration includes:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DATABASE`

Production secrets should be managed through the cloud provider, container platform, or secret-management service.

## Docker Configuration

The production-style Compose configuration loads variables from `.env`.

The API service overrides:

`DB_HOST=db`

This allows the API container to connect to the PostgreSQL container using the Docker Compose service name rather than `localhost`.

## Security Guidelines

- Never commit `.env`.
- Keep `.env.example` free of real secrets.
- Use different credentials for development, staging, and production.
- Store CI/CD secrets using GitHub Actions Secrets or the deployment platform's secret manager.
- Rotate production credentials when exposure is suspected.
- Avoid printing passwords, tokens, or connection strings in CI logs.

## CI/CD

GitHub Actions should use repository or environment secrets for sensitive configuration when required.

The current CI workflow does not require production database credentials because the unit-test stage uses mocked repositories.

If integration or deployment tests are added later, environment-specific secrets should be injected only into the relevant workflow jobs.

## Current Status

Environment configuration is documented and `.env.example` is available as the configuration template.

No real environment secrets are intended to be committed to the repository.