import { poductService } from "./product.service";
import { productRepository } from "../repositories/product.repository";
import { transactionRepository } from "../repositories/transaction.repository";

describe('productService', () => {
  describe('flashSale', () => {
    it('should return flash sale details when active', async () => {
      const mockFlashSale = {
        id: 1,
        product: {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          image: 'image1.jpg',
          price: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          productId: 1,
          startAt: new Date(Date.now() - 1000),
          endAt: new Date(Date.now() + 1000),
          quota: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        quota: 10,
        startAt: new Date(Date.now() - 1000),
        endAt: new Date(Date.now() + 1000),
        discount: 20,
      };
      jest.spyOn(productRepository, 'findFlashSale').mockResolvedValue(mockFlashSale);

      const result = await poductService.flashSale();

      expect(result).toEqual({
        id: mockFlashSale.product.id,
        name: mockFlashSale.product.name,
        description: mockFlashSale.product.description,
        image: mockFlashSale.product.image,
        quantity: mockFlashSale.quota,
        price: mockFlashSale.product.price,
        flashSaleId: mockFlashSale.id,
        flashSaleStartedAt: mockFlashSale.startAt,
        flashSaleEndedAt: mockFlashSale.endAt,
        flashSaleStatus: 'active',
        flashSaleDiscount: mockFlashSale.discount,
        salePrice: mockFlashSale.product.price - mockFlashSale.discount,
      });
      expect(productRepository.findFlashSale).toHaveBeenCalled();
    });

    it('should return null when no flash sale is found', async () => {
      jest.spyOn(productRepository, 'findFlashSale').mockResolvedValue(null);

      const result = await poductService.flashSale();

      expect(result).toBeNull();
      expect(productRepository.findFlashSale).toHaveBeenCalled();
    });
  });

  describe('purchaseStatus', () => {
    it('should return purchase details when transaction is found', async () => {
      const mockTransaction = {
        product: {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          image: 'image1.jpg',
          price: 100,
        },
        flashSale: {
          id: 1,
          discount: 20,
        },
        quantity: 1,
        createdAt: new Date(),
      };
      jest.spyOn(transactionRepository, 'findByUserIdAndFlashSaleId').mockResolvedValue(mockTransaction);

      const result = await poductService.purchaseStatus(1, 1);

      expect(result).toEqual({
        flashSaleId: mockTransaction.flashSale.id,
        productId: mockTransaction.product.id,
        name: mockTransaction.product.name,
        description: mockTransaction.product.description,
        image: mockTransaction.product.image,
        originalPrice: mockTransaction.product.price,
        price: mockTransaction.product.price - mockTransaction.flashSale.discount,
        quantity: mockTransaction.quantity,
        status: 'success',
        createdAt: mockTransaction.createdAt,
      });
      expect(transactionRepository.findByUserIdAndFlashSaleId).toHaveBeenCalledWith(1, 1);
    });

    it('should throw an error when transaction is not found', async () => {
      jest.spyOn(transactionRepository, 'findByUserIdAndFlashSaleId').mockResolvedValue(null);

      await expect(poductService.purchaseStatus(1, 1)).rejects.toThrow('Your order is not found, try again on next flash sale');
      expect(transactionRepository.findByUserIdAndFlashSaleId).toHaveBeenCalledWith(1, 1);
    });
  });
});

