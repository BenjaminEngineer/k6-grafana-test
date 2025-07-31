import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3, // Key for Smoke test. Keep it at 2, 3, max 5 VUs
  duration: '20s', // This can be shorter or just a few iterations
};

export default () => {
  // Base URL from swagger.json
  const baseUrl = 'https://petstore.swagger.io/v2';
  
  // User data payload based on User definition from swagger.json
  const userData = {
    id: Math.floor(Math.random() * 10000), // Random ID
    username: `testuser${Math.floor(Math.random() * 1000)}`,
    firstName: 'Test',
    lastName: 'User',
    email: `test${Math.floor(Math.random() * 1000)}@example.com`,
    password: 'testPassword123',
    phone: '+1234567890',
    userStatus: 1
  };

  // Headers for JSON content
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // POST request to create user
  const createUserRes = http.post(
    `${baseUrl}/user`,
    JSON.stringify(userData),
    params
  );

  // Check if user creation was successful
  check(createUserRes, {
    'user creation status is 200 or default response': (r) => r.status === 200 || r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'no error in response': (r) => !r.body.includes('error'),
    'user created successfully': (r) => r.body.includes('code'),
  });

  // Log response for debugging
  console.log(`User creation response status: ${createUserRes}`);
  
  // Verify user was created by getting user by username
  const getUserRes = http.get(`${baseUrl}/user/${userData.username}`);
  
  // Check if user retrieval was successful and verify all fields
  check(getUserRes, {
    'get user status is 200': (r) => r.status === 200,
    'get user response time < 500ms': (r) => r.timings.duration < 500,
    'retrieved user has correct id': (r) => {
      try {
        const user = JSON.parse(r.body);
        return user.id === userData.id;
      } catch (e) {
        return false;
      }
    },
    'retrieved user has correct username': (r) => {
      try {
        const user = JSON.parse(r.body);
        return user.username === userData.username;
      } catch (e) {
        return false;
      }
    },
    'retrieved user has correct firstName': (r) => {
      try {
        const user = JSON.parse(r.body);
        return user.firstName === userData.firstName;
      } catch (e) {
        return false;
      }
    },
    'retrieved user has correct lastName': (r) => {
      try {
        const user = JSON.parse(r.body);
        return user.lastName === userData.lastName;
      } catch (e) {
        return false;
      }
    },
    'retrieved user has correct email': (r) => {
      try {
        const user = JSON.parse(r.body);
        return user.email === userData.email;
      } catch (e) {
        return false;
      }
    },
    'retrieved user has correct phone': (r) => {
      try {
        const user = JSON.parse(r.body);
        return user.phone === userData.phone;
      } catch (e) {
        return false;
      }
    },
    'retrieved user has correct userStatus': (r) => {
      try {
        const user = JSON.parse(r.body);
        return user.userStatus === userData.userStatus;
      } catch (e) {
        return false;
      }
    }
  });

  // Log get user response for debugging
  console.log(`Get user response status: ${getUserRes.status}`);
  
  sleep(1);
};
