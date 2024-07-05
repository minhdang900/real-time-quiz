import { CreateProductPortDto, ProductPortDto } from '../dto';

export const ProductServiceName = 'ProductService.Interface';

export interface ProductService {
  getProducts(): Promise<ProductPortDto[]>;
  createProduct(product: CreateProductPortDto): Promise<ProductPortDto>;
}
