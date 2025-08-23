import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { poductService } from "../services/product.service";

export async function flashSaleHandler(request: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>) {
  const cached = await reply.server.redis.get('flashSale');
  if (cached) {
    return JSON.parse(cached);
  }

  const flashSale = await poductService.flashSale();

  if (!flashSale) return reply.notFound("Flash sale not found");

  if (flashSale.flashSaleStatus === 'upcoming') {
    await reply.server.redis.set('flashSale', JSON.stringify(flashSale), 'EX', Math.floor((new Date(flashSale.flashSaleStartedAt).getTime() - new Date().getTime()) / 1000));
  }

  return flashSale;
}

