import http from 'k6/http';
import { check, sleep } from 'k6';
import { API } from '../config/config.js';

export function timelineScenario(token) {
  const headers = { Authorization: `Bearer ${token}` };

  const globalRes = http.get(`${API}/posts?page=0&size=20&type=global`, {
    headers,
    tags: { endpoint: 'timeline' },
  });
  check(globalRes, { 'timeline global 200': (r) => r.status === 200 });

  sleep(1);

  const followRes = http.get(`${API}/posts?page=0&size=20&type=following`, {
    headers,
    tags: { endpoint: 'timeline' },
  });
  check(followRes, { 'timeline following 200': (r) => r.status === 200 });

  sleep(1);
}
