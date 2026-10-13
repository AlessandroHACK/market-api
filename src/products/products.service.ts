import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { slugify } from '../common/helpers/slugify.helper';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isUUID } from 'class-validator';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) { }


  async create(createProductDto: CreateProductDto) {
    const { images = [], ...productDetails } = createProductDto;

    try {
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });

      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const [data, total] = await this.productRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { name: 'ASC' },
      relations: { images: true },
    });

    return { data, total, limit, offset };
  }

  async findOne(term: string) {
    // Search by id if term is a UUID, otherwise by slug
    const where = isUUID(term) ? { id: term } : { slug: term.toLowerCase() };
    const product = await this.productRepository.findOne({ where, relations: { images: true } });

    if (!product) {
      throw new NotFoundException(`Producto "${term}" no encontrado`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    // preload: SELECT by id, then merge the given fields over the existing row.
    // Returns undefined if the id doesn't exist.
    const product = await this.productRepository.preload({ id, ...toUpdate });
    if (!product) throw new NotFoundException(`Producto "${id}" no encontrado`);

    //create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(url => this.productImageRepository.create({ url }));
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      // Reconsultamos para devolver siempre las imágenes actuales, se hayan mandado o no en el body
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }
  }


  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async removeAllProducts() {

    try {
      return await this.productRepository.createQueryBuilder('product')
        .delete()
        .execute()
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error instanceof QueryFailedError) {
      const { code, detail } = error.driverError as { code?: string; detail?: string };

      // 23505 = unique_violation (name o slug duplicado)
      if (code === '23505') {
        throw new ConflictException('Ya existe un producto con ese nombre');
      }
      // 23502 = not_null_violation, 22P02 = formato inválido (ej. uuid)
      if (code === '23502' || code === '22P02') {
        throw new BadRequestException(detail ?? 'Datos inválidos');
      }
      // 23503 = foreign_key_violation (ej. referencia a un producto inexistente)
      if (code === '23503') {
        throw new BadRequestException(detail ?? 'Referencia inválida');
      }
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revise los logs del servidor');
  }
}
