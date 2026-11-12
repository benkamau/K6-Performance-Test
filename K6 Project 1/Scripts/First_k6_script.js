import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io';

export const options = {

  stages: [
    { duration: '10s', target: 5 }, // Ramp-up to 5 virtual users over 10 seconds
    { duration: '20s', target: 10 }, // Stay at 10 virtual users for 20 seconds
    { duration: '10s', target: 0 }, // Ramp-down to 0 virtual users over 10 seconds
  ],

  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};

export default function () {
  const response = http.get(BASE_URL);

  check (response, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1);
}
export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}  