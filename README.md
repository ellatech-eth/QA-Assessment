# Ella API - QA Assessment

This repository contains a NestJS API designed for QA Engineer assessments. It simulates an e-commerce backend with Users, Products, and Transactions modules.

## Assessment Instructions

Your task is to verify the quality of this API. This includes:
1.  **Exploratory Testing**: Identify and document bugs in the system.
2.  **Unit Tests**: Write unit tests for **ONE** of the modules (Users, Products, or Transactions) to ensure logic correctness.
3.  **API Testing**: Create a Postman collection to test the endpoints.
4.  **Performance Testing**: Create a k6 script to load test one of the endpoints.

## Getting Started

### Prerequisites
- Node.js
- Docker & Docker Compose

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start Database (Docker)**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

3. **Run Migrations**
   Generate and run migrations to set up the database schema:
   ```bash
   npm run migration:generate
   npm run migration:run
   ```

4. **Start Application**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:4000`.

## API Documentation

Once the application is running, you can access the Swagger documentation at:
- UI: http://localhost:4000/api
- JSON: http://localhost:4000/api-json

## Testing

As part of the assessment, you are expected to create tests.
- **Unit Tests**: `npm test` (configured to run Jest)
- **E2E Tests**: `npm run test:e2e`

## Deployment (Docker)

To build and run the entire stack (App + DB):

```bash
docker compose up -d --build
```
