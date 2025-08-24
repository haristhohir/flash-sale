import { FastifyInstance } from 'fastify';
import { loginHandler } from '../handlers/auth.handler';
import { loginSchema } from '../dto/auth.dto';
import { flashSaleHandler, purchaseHandler, purchaseStatusHandler } from '../handlers/product.handler';
import { authMiddleware } from '../middlewares/auth.middleware';
import { purchaseSchema } from '../dto/transaction.dto';
import { rateLimiterMiddleware } from '../middlewares/rate-limiter.middleware';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', function () {
    return { message: 'Flash Sale API' };
  });

  fastify.post('/auth/login', { schema: loginSchema }, loginHandler);
  fastify.get('/product/flash-sale', { preHandler: authMiddleware }, flashSaleHandler);
  fastify.post('/product/purchase', {
    preHandler: [authMiddleware, rateLimiterMiddleware],
    schema: purchaseSchema
  }, purchaseHandler);
  fastify.get('/product/purchase/:id', { preHandler: [authMiddleware] }, purchaseStatusHandler);
  fastify.get('/test/auth/tokens', async function () { });
}
