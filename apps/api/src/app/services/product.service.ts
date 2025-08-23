import { productRepository } from "../repositories/product.repository";

export const poductService = {
  flashSale: async () => {
    const flashSale = await productRepository.findFlashSale();
    if (!flashSale) {
      return null;
    }

    const now = new Date();
    let flashSaleStatus = 'ongoing';

    if (flashSale.startAt > now) {
      flashSaleStatus = 'upcoming';
    }

    if (flashSale.endAt < now) {
      flashSaleStatus = 'ended';
    }

    return {
      name: flashSale.product.name,
      description: flashSale.product.description,
      image: flashSale.product.image,
      price: flashSale.product.price,
      flashSaleStartedAt: flashSale.startAt,
      flashSaleEndedAt: flashSale.endAt,
      flashSaleStatus,
    };
  }
}
