import { productRepository } from "../repositories/product.repository";
import { transactionRepository } from "../repositories/transaction.repository";

export const poductService = {
  flashSale: async () => {
    const flashSale = await productRepository.findFlashSale();
    if (!flashSale) {
      return null;
    }

    const now = new Date();
    let flashSaleStatus = 'active';

    if (flashSale.startAt > now) {
      flashSaleStatus = 'upcoming';
    }

    if (flashSale.endAt < now) {
      flashSaleStatus = 'ended';
    }

    return {
      id: flashSale.product.id,
      name: flashSale.product.name,
      description: flashSale.product.description,
      image: flashSale.product.image,
      quantity: flashSale.quota,
      price: flashSale.product.price,
      flasSaleId: flashSale.id,
      flashSaleStartedAt: flashSale.startAt,
      flashSaleEndedAt: flashSale.endAt,
      flashSaleStatus,
      flashSaleDiscount: flashSale.discount
    };
  },
  purchaseStatus: async (userId: number, flashSaleId: number) => {
    const transaction = await transactionRepository.findByUserIdAndFlashSaleId(userId, flashSaleId);

    if (!(transaction && transaction.product && transaction.flashSale)) {
      throw new Error('Your order is not found, try again on next flash sale');
    }

    const { product, flashSale } = transaction;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      originalPrice: product.price,
      price: product.price - flashSale.discount,
      status: 'success',
    }
  },
}

