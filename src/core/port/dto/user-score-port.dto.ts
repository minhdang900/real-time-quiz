import { ProductOds } from 'src/core/domain/entity';

export class ProductOdsPortDto {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;

  constructor(init?: Partial<ProductOdsPortDto>) {
    Object.assign(this, init);
  }

  public static new(productOds: ProductOds): ProductOdsPortDto {
    return new ProductOdsPortDto({
      id: productOds.id,
      name: productOds.name,
      description: productOds.description,
      imageUrl: productOds.imageUrl,
      price: productOds.price,
    });
  }

  public static newList(productOdsList: ProductOds[]): ProductOdsPortDto[] {
    return productOdsList.map(
      (productOds) =>
        new ProductOdsPortDto({
          id: productOds.id,
          name: productOds.name,
          description: productOds.description,
          imageUrl: productOds.imageUrl,
          price: productOds.price,
        }),
    );
  }
}
