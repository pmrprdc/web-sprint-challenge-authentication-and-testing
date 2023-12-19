const request = require('supertest');
const server = require('../api/server'); // Adjust the path according to your project structure
const db = require('../data/dbConfig'); // Adjust the path for your database configuration

// Helper function to register and login for getting the token
async function authenticate() {
  await request(server)
    .post('/api/auth/register')
    .send({ username: 'testuser', password: 'password123' });

  const response = await request(server)
    .post('/api/auth/login')
    .send({ username: 'testuser', password: 'password123' });

  return response.body.token;
}

beforeEach(async () => {
  // Reset the database before each test
  await db('users').truncate(); // Adjust according to your database setup
});

describe('Authentication and Jokes Endpoints', () => {
  // Tests for /api/auth/register
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'newuser', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.username).toBe('newuser');
    });

    it('should not register a user with an existing username', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'duplicateuser', password: 'password123' });

      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'duplicateuser', password: 'password123' });

      expect(res.status).toBe(400); // Or 409, depending on implementation
    });
  });

  // Tests for /api/auth/login
  describe('POST /api/auth/login', () => {
    it('should login a registered user', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'loginuser', password: 'password123' });

      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'loginuser', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'nonexistent', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });
  });

  // Tests for /api/jokes
  describe('GET /api/jokes', () => {
    it('should return jokes for authenticated users', async () => {
      const token = await authenticate();

      const res = await request(server)
        .get('/api/jokes')
        .set('Authorization', token);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array); // Assuming jokes are returned as an array
    });

    it('should not return jokes for unauthenticated requests', async () => {
      const res = await request(server)
        .get('/api/jokes');

      expect(res.status).toBe(401);
    });
  });
});
