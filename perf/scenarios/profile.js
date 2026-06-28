import http from 'k6/http';
import { check, sleep } from 'k6';
import { API } from '../config/config.js';

export function profileScenario(token) {
  const headers = { Authorization: `Bearer ${token}` };

  const searchRes = http.get(`${API}/users?q=perfuser`, {
    headers,
    tags: { endpoint: 'profile' },
  });
  if (searchRes.status !== 200) return;
  const results = searchRes.json();
  if (!results || results.length === 0) return;

  const userId = results[Math.floor(Math.random() * results.length)].id;

  const profileRes = http.get(`${API}/users/${userId}`, {
    headers,
    tags: { endpoint: 'profile' },
  });
  check(profileRes, { 'profile 200': (r) => r.status === 200 });

  sleep(2);
}
