import axios from 'axios';

describe('Product Endpoints', () => {
  let accessToken: string;
  describe('GET /product/flash-sale', () => {

    beforeAll(async () => {
      const loginRes = await axios.post('/auth/login', {
        email: 'haris@thohir.com',
        password: 'password',
      });
      accessToken = loginRes.data.data.accessToken;
    });

    it('should return flash sale details when active', async () => {
      const res = await axios.get('/product/flash-sale', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(res.status).toBe(200);
      expect(res.data.data).toHaveProperty('id');
      expect(res.data.data).toHaveProperty('name');
    });

    it('should return 404 when no flash sale is found', async () => {
      try {
        await axios.get('/product/flash-sale', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.error).toHaveProperty('message', 'Flash sale not found');
      }
    });
  });

  describe('POST /product/purchase', () => {
    it('should process a purchase request successfully', async () => {
      const res = await axios.post(
        '/product/purchase',
        {
          id: 1,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      expect(res.status).toBe(200);
      expect(res.data.data).toHaveProperty('message', 'Order is being processed');
    });

    it('should return 409 when there is a conflict in the purchase request', async () => {
      try {
        await axios.post(
          '/product/purchase',
          {
            id: 1,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } catch (error: any) {
        expect(error.response.status).toBe(409);
        expect(error.response.data.error).toHaveProperty('message');
      }
    });
  });

  describe('GET /product/purchase/:id', () => {
    it('should return purchase status for a valid transaction', async () => {
      const res = await axios.get('/product/purchase/1', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      expect(res.status).toBe(200);
      expect(res.data.data).toHaveProperty('status', 'success');
    });

    it('should return 404 when no transaction is found', async () => {
      try {
        await axios.get('/product/purchase/999', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.error).toHaveProperty('message', 'Your order is not found, try again on next flash sale');
      }
    });
  });
});
