import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed.data';


@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService
  ){}
  async runSeed(){
    await this.insertNewProducts();
    return 'SEED EXECUTED';
  }

  private async insertNewProducts(){
    await this.productsService.removeAllProducts();

    for (const product of initialData.products) {
      await this.productsService.create(product);
    }

    return true;
  }
}
