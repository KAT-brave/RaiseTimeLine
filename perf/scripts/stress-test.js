import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { SharedArray } from 'k6/data';
import { login } from '../scenarios/auth.js';
import { timelineScenario } from '../scenarios/timeline.js';
import { interactionScenario } from '../scenarios/interaction.js';

const users = new SharedArray('users', () => JSON.parse(open('../data/users.json')));

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
  stages: [
    { duration: '3m', target: 10 },
    { duration: '3m', target: 30 },
    { duration: '3m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '3m', target: 150 },
    { duration: '3m', target: 200 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  const user = users[Math.floor(Math.random() * users.length)];
  const token = login(user.email, user.password);
  if (!token) return;

  if (Math.random() < 0.7) {
    timelineScenario(token);
  } else {
    interactionScenario(token);
  }
}

export function handleSummary(data) {
  return {
    'results/stress-test-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
