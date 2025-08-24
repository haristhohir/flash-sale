import { productRepository } from "../repositories/product.repository";

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
}

