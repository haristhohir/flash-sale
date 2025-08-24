import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import amqplib, { Channel } from "amqplib";

declare module "fastify" {
  interface FastifyInstance {
    rabbitmq: {
      channel: Channel;
    };
  }
}

export default fastifyPlugin(async function (fastify: FastifyInstance) {
  const connection = await amqplib.connect("amqp://admin:secret@localhost:5672");
  const channel = await connection.createChannel();

  await channel.assertQueue('flash_sale_orders', { durable: true });

  fastify.decorate("rabbitmq", { channel });

  fastify.addHook("onClose", async () => {
    await channel.close();
    await connection.close();
  });

  channel.consume('flash_sale_orders', (msg) => {
    if (!msg) return;

    const order = JSON.parse(msg.content.toString());
    console.log("📦 Processing order:", order);

    // TODO: implement processOrder(order)
    // - check stock in Redis (atomic)
    // - deduct stock
    // - create order in DB

    const success = true; // simulate result

    if (success) {
      channel.ack(msg);
      console.log("✅ Order confirmed for user:", order.userId);
    } else {
      channel.nack(msg, false, false); // send to DLX if configured
      console.log("❌ Order failed for user:", order.userId);
    }
  });

});
