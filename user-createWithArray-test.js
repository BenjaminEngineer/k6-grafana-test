import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3, // Key for Smoke test. Keep it at 2, 3, max 5 VUs
  duration: '20s', // This can be shorter or just a few iterations
};

export default function () {
  const url = 'https://petstore.swagger.io/v2/user/createWithArray';
  const payload = JSON.stringify([
    {
      id: 1001,
      username: 'userA',
      firstName: 'User',
      lastName: 'A',
      email: 'usera@example.com',
      password: 'passwordA',
      phone: '123-456-7890',
      userStatus: 1
    },
    {
      id: 1002,
      username: 'userB',
      firstName: 'User',
      lastName: 'B',
      email: 'userb@example.com',
      password: 'passwordB',
      phone: '987-654-3210',
      userStatus: 1
    }
  ]);
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, { 'status returned 200': (r) => r.status === 200 });
  sleep(1);
}
