import http from 'k6/http';
import { check, sleep } from 'k6';
import { API } from '../config/config.js';

export function postScenario(token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const content = `パフォーマンステスト投稿 ${Date.now()}`;
  const res = http.post(
    `${API}/posts`,
    JSON.stringify({ content }),
    { headers, tags: { endpoint: 'create_post' } }
  );
  check(res, { 'create post 201': (r) => r.status === 201 });

  sleep(2);
}
