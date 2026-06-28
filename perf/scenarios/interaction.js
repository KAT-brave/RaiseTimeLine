import http from 'k6/http';
import { check, sleep } from 'k6';
import { API } from '../config/config.js';

export function interactionScenario(token) {
  const headers = { Authorization: `Bearer ${token}` };

  const timelineRes = http.get(`${API}/posts?page=0&size=20&type=global`, {
    headers,
    tags: { endpoint: 'timeline' },
  });
  if (timelineRes.status !== 200) return;

  const posts = timelineRes.json('posts');
  if (!posts || posts.length === 0) return;

  const postId = posts[Math.floor(Math.random() * posts.length)].id;

  const likeRes = http.post(
    `${API}/posts/${postId}/likes`,
    null,
    { headers, tags: { endpoint: 'like' } }
  );
  check(likeRes, { 'like 200/201': (r) => r.status === 200 || r.status === 201 });

  sleep(1);

  const commentsRes = http.get(`${API}/posts/${postId}/comments`, {
    headers,
    tags: { endpoint: 'comments' },
  });
  check(commentsRes, { 'comments 200': (r) => r.status === 200 });

  sleep(1);
}
