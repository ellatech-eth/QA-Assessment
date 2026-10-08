import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const response = http.get('http://localhost:4000/products');

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has data': (r) => r.body && r.body.length > 0,
  });

  sleep(1);
}