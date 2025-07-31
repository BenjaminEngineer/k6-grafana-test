import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3, // Key for Smoke test. Keep it at 2, 3, max 5 VUs
  duration: '20s', // This can be shorter or just a few iterations
};

export default function () {
  const baseUrl = 'https://petstore.swagger.io/v2';
  const users = [
    {
      id: Math.floor(Math.random() * 10000),
      username: `user${Math.floor(Math.random() * 1000)}`,
      firstName: 'Test',
      lastName: 'User',
      email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      password: 'testPassword123',
      phone: '+1234567890',
      userStatus: 1
    }
  ];

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${baseUrl}/user/createWithList`, JSON.stringify(users), params);

  check(res, {
    'status returned 200': (r) => r.status === 200,
    'no error in response': (r) => !r.body.includes('error'),
  });

  sleep(1);
}