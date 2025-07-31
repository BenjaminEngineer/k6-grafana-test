import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 3, // Key for Smoke test. Keep it at 2, 3, max 5 VUs
    duration: '20s', // This can be shorter or just a few iterations
};

export default function () {
    // Replace 'user1' with any valid username as needed
    const username = 'user1';
    const url = `https://petstore.swagger.io/v2/user/${username}`;
    const res = http.get(url);

    check(res, {
        'status returned 200': (r) => r.status === 200,
        'response has username': (r) => r.json('username') === username,
    });

    sleep(1);
}
