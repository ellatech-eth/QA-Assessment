# Health Check and Monitoring

## Health Endpoint

A lightweight application health endpoint was added:

`GET /health`

### Response

The endpoint returns:

- HTTP 200
- Application status
- Service name
- Current timestamp

Example:

```json
{
  "statusCode": 200,
  "status": "ok",
  "service": "ella-api",
  "timestamp": "2026-10-08T14:31:45.925Z"
}