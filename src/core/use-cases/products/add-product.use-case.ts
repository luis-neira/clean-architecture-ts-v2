import { Result } from '../../lib/result';
import { Product } from '../../entities';
import { ProductMapper } from '../../mappers/product';
import IEntityMapper from '../../mappers/i-entity-mapper'
import { IProductDto } from '../../dtos/product'

import { IUseCaseInputBoundary, IUseCaseOutputBoundary } from '../interfaces';
import { IProductsGateway, IAddProductRequestModel } from '../interfaces';

export default class AddProductUseCase implements IUseCaseInputBoundary {
  private productsRepository: IProductsGateway;
  private presenter: IUseCaseOutputBoundary;
  private dataMapper: IEntityMapper<Product, IProductDto>;

  public constructor(
    productsRepository: IProductsGateway,
    presenter: IUseCaseOutputBoundary
  ) {
    this.productsRepository = productsRepository;
    this.presenter = presenter;
    this.dataMapper = new ProductMapper();
  }

  async execute(requestModel: IAddProductRequestModel): Promise<void> {
    const { name, description, images, price, color, meta } = requestModel;

    const product = Product.create(
      {
        name,
        description,
        images,
        price,
        color,
        meta
      },
      null
    );

    try {
      const addedProduct = await this.productsRepository.create(product);

      const addedProductDto = this.dataMapper.toDTO(addedProduct);

      this.presenter.execute(addedProductDto);
    } catch (err) {
      throw Result.fail(err);
    }
  }
}
