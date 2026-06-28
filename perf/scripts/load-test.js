import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { SharedArray } from 'k6/data';
import { thresholds } from '../config/thresholds.js';
import { login } from '../scenarios/auth.js';
import { timelineScenario } from '../scenarios/timeline.js';
import { postScenario } from '../scenarios/post.js';
import { interactionScenario } from '../scenarios/interaction.js';
import { profileScenario } from '../scenarios/profile.js';

const users = new SharedArray('users', () => JSON.parse(open('../data/users.json')));

export const options = {
  thresholds,
  scenarios: {
    timeline: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 30 },
        { duration: '10m', target: 30 },
        { duration: '2m', target: 0 },
      ],
      exec: 'timelineExec',
    },
    post: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 7 },
        { duration: '10m', target: 7 },
        { duration: '2m', target: 0 },
      ],
      exec: 'postExec',
    },
    interaction: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 8 },
        { duration: '10m', target: 8 },
        { duration: '2m', target: 0 },
      ],
      exec: 'interactionExec',
    },
    profile: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 5 },
        { duration: '10m', target: 5 },
        { duration: '2m', target: 0 },
      ],
      exec: 'profileExec',
    },
  },
};

function getToken() {
  const user = users[Math.floor(Math.random() * users.length)];
  return login(user.email, user.password);
}

export function timelineExec() {
  const token = getToken();
  if (token) timelineScenario(token);
}

export function postExec() {
  const token = getToken();
  if (token) postScenario(token);
}

export function interactionExec() {
  const token = getToken();
  if (token) interactionScenario(token);
}

export function profileExec() {
  const token = getToken();
  if (token) profileScenario(token);
}

export function handleSummary(data) {
  return {
    'results/load-test-report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
