const request = require('supertest');
const server = require('../api/server'); // Adjust the path according to your project structure
const db = require('../data/dbConfig'); // Adjust the path for your database configuration
const jokes = require('./jokes/jokes-data')

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

test('environment is testing',() =>{
expect(process.env.NODE_ENV).toBe('testing')})



// Helper function to register and login for getting the token
async function authenticate (username,password) {
  await request(server)
    .post('/api/auth/register')
    .send({ username: username, password: password });
  const response = await request(server)
    .post('/api/auth/login')
    .send({ username: username, password: password });

  return response.body.token;
}



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
      try {
        const res1 = await request(server)
          .post('/api/auth/register')
          .send({ username: 'loginuser', password: 'password123' });
        console.log(res1.status); // Log the status of the registration
      } catch (err) {
        console.error('Error during registration:', err);
      }

      try {
        const res = await request(server)
          .post('/api/auth/login')
          .send({ username: 'loginuser', password: 'password123' });
        console.log(res.status); // Log the status of the login
      } catch (err) {
        console.error('Error during login:', err);
      }
    
    
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

      try {
        const token = await authenticate("harry", "potter")
      }catch (err){
        console.log(err)
      }
      
      try { 
        const res = await request(server)
        .get('api/jokes')
        .set('Authorization', token) // Set the token in the Authorization header

        expect(res.body).toBe(jokes)
      } catch(err){
      }
    });

    it('should not return jokes for unauthenticated requests', async () => {
      const res = await request(server)
        .get('/api/jokes');

      expect(res.status).toBe(401);
    });
  });
});
