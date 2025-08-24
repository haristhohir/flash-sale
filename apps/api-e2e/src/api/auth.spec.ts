import axios from 'axios';

describe('POST /auth/login', () => {
  it('should return an access token for valid credentials', async () => {
    const res = await axios.post('/auth/login', {
      email: 'haris@thohir.com',
      password: 'password',
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('data');
    expect(res.data.data).toHaveProperty('accessToken');
  });

  it('should return 401 for invalid credentials', async () => {
    try {
      await axios.post('/auth/login', {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty('error');
      expect(error.response.data.error).toHaveProperty('message', 'Invalid credentials');
    }
  });
});

