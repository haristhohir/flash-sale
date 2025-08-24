import { FastifyInstance } from 'fastify';
import { loginHandler } from '../handlers/auth.handler';
import { loginSchema } from '../dto/auth.dto';
import { flashSaleHandler, purchaseHandler } from '../handlers/product.handler';
import { authMiddleware } from '../middlewares/auth.middleware';
import { purchaseSchema } from '../dto/transaction.dto';
import { rateLimiterMiddleware } from '../middlewares/rate-limiter.middleware';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', function () {
    return { message: 'Flash Sale API' };
  });

  fastify.post('/auth/login', { schema: loginSchema }, loginHandler);
  fastify.get('/products/flash-sale', { preHandler: authMiddleware }, flashSaleHandler);
  fastify.post('/products/purchase', {
    preHandler: [authMiddleware, rateLimiterMiddleware],
    schema: purchaseSchema
  }, purchaseHandler);
}
