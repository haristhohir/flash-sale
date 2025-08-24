import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { poductService } from "../services/product.service";
import { PurchaseRequestDto } from "../dto/transaction.dto";
import { FLASH_SALE_CACHE_KEY, FLASH_SALE_STOCK_KEY } from "../constants/redis.constant";
import { FLASH_SALE_QUEUE } from "../constants/queue.constant";

export async function flashSaleHandler(request: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>) {
  const redis = reply.server.redis;
  const cached = await redis.get(FLASH_SALE_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const flashSale = await poductService.flashSale();

  if (!flashSale) return reply.notFound("Flash sale not found");

  if (flashSale.flashSaleStatus === 'upcoming') {
    await redis.set(FLASH_SALE_CACHE_KEY, JSON.stringify(flashSale), 'EX', Math.floor((new Date(flashSale.flashSaleStartedAt).getTime() - new Date().getTime()) / 1000));
    await redis.set(FLASH_SALE_STOCK_KEY, flashSale.quantity);
  }

  return flashSale;
}

export async function purchaseHandler(request: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>) {
  const userId = (request.user as any).sub;
  const { id: productId } = request.body as PurchaseRequestDto;

  try {
    const order = { userId, productId };
    reply.server.rabbitmq.channel.sendToQueue(FLASH_SALE_QUEUE, Buffer.from(JSON.stringify(order)), { persistent: true });
    return { message: 'Order is being processed' };
  } catch (error: any) {
    return reply.conflict(error.message);
  }
}

export async function purchaseStatusHandler(request: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>) {
  const userId = (request.user as any).sub;
  const { id: flashSaleId } = request.params as { id: string };

  try {
    const result = await poductService.purchaseStatus(userId, +flashSaleId);

    return result;
  } catch (error: any) {
    console.error(error);
    return reply.notFound(error.message);
  }


}
