import http from 'k6/http';
import { check } from 'k6';
import { API } from '../config/config.js';

export function login(email, password) {
  const res = http.post(
    `${API}/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' }, tags: { endpoint: 'login' } }
  );
  check(res, { 'login 200': (r) => r.status === 200 });
  return res.status === 200 ? res.json('token') : null;
}
