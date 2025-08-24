import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import amqplib, { Channel } from "amqplib";
import env from "../config/env";
import { FLASH_SALE_QUEUE } from "../constants/queue.constant";
import { FLASH_SALE_CACHE_KEY, FLASH_SALE_STOCK_KEY } from "../constants/redis.constant";
import { poductService } from "../services/product.service";
import { transactionRepository } from "../repositories/transaction.repository";

declare module "fastify" {
  interface FastifyInstance {
    rabbitmq: {
      channel: Channel;
    };
  }
}

export default fastifyPlugin(async function (fastify: FastifyInstance) {
  const connection = await amqplib.connect(env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(FLASH_SALE_QUEUE, { durable: true });

  fastify.decorate("rabbitmq", { channel });

  fastify.addHook("onClose", async () => {
    await channel.close();
    await connection.close();
  });


  channel.consume(FLASH_SALE_QUEUE, async (msg) => {
    if (!msg) return;

    const redis = fastify.redis;
    const order = JSON.parse(msg.content.toString());
    console.log("📦 Processing order:", order);

    const cached = await redis.get(FLASH_SALE_CACHE_KEY);
    let flashSale = null;
    if (cached) {
      flashSale = JSON.parse(cached);
    } else {
      flashSale = await poductService.flashSale();
      if (flashSale) {
        let expiredAt = flashSale.flashSaleStartedAt;
        if (flashSale.flashSaleStatus === 'active') {
          expiredAt = flashSale.flashSaleEndedAt;
        }

        if (flashSale.flashSaleStatus != 'ended') {
          await redis.set(FLASH_SALE_CACHE_KEY, JSON.stringify(flashSale), 'EX', Math.floor((new Date(expiredAt).getTime() - new Date().getTime()) / 1000));
        }
      }
    }

    if (!flashSale) {
      channel.ack(msg);
      return;
    }

    if (flashSale.flashSaleStatus !== 'active') {
      channel.ack(msg);
      return;
    }


    const stock = await redis.get(FLASH_SALE_STOCK_KEY);
    const stockNumber = stock ? parseInt(stock) : 0;

    if (stockNumber <= 0) {
      channel.ack(msg);
      return;
    }
    console.log("Stock available:", stockNumber);

    const transacton = await transactionRepository.findByProductIdAndFlashSaleId(+order.productId, flashSale.flashSaleId);
    if (transacton) {
      console.log("User has already purchased this product in flash sale:", order.userId);
      channel.ack(msg);
      return;
    }

    await transactionRepository.create({
      userId: +order.userId,
      productId: +order.productId,
      flashSaleId: +flashSale.id,
      totalPrice: (flashSale.price - flashSale.flashSaleDiscount),
      quantity: 1,
    });

    console.log("Current stock:", stock);
    await redis.decr(FLASH_SALE_STOCK_KEY);

    channel.ack(msg);
    console.log("✅ Order confirmed for user:", order.userId);
  });

});
