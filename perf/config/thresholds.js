export const thresholds = {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  'http_req_duration{endpoint:login}': ['p(95)<800'],
  'http_req_duration{endpoint:create_post}': ['p(95)<1000'],
  'http_req_duration{endpoint:like}': ['p(95)<300'],
  'http_req_duration{endpoint:timeline}': ['p(95)<500'],
  'http_req_duration{endpoint:comments}': ['p(95)<500'],
  'http_req_duration{endpoint:profile}': ['p(95)<400'],
};
