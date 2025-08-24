
import prisma from "../lib/prisma"

export const productRepository = {
  findFlashSale: async () => {
    return prisma.flashSale.findFirst({
      where: {
        deletedAt: null,
      },
      include: {
        product: true
      }
    });
  },
  findProductById: async (id: number) => {
    return prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        FlashSale: true
      }
    });
  }
}
