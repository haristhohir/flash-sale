import prisma from "../lib/prisma"

export const transactionRepository = {
  findByProductIdAndFlashSaleId: async (productId: number, flashSaleId: number) => {
    return prisma.transaction.findFirst({
      where: {
        productId,
        flashSaleId,
        deletedAt: null,
      },
      include: {
        product: true
      }
    });
  },
  create: async (data: { productId: number, userId: number, flashSaleId: number, totalPrice: number, quantity: number }) => {
    const { productId, userId, flashSaleId, totalPrice, quantity } = data;
    return prisma.transaction.create({
      data: {
        userId,
        productId,
        flashSaleId,
        totalPrice,
        quantity,
      }
    });
  },
  findByUserIdAndFlashSaleId: async (userId: number, flashSaleId: number) => {
    return prisma.transaction.findFirst({
      where: {
        userId,
        flashSaleId,
      },
      include: {
        product: true,
        flashSale: true,
      }
    });
  },
}
