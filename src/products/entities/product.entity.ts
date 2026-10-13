import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { slugify } from "../../common/helpers/slugify.helper";
import { ProductImage } from "./product-image.entity";

@Entity({name: 'products'})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 60, unique: true })
    name: string;

    @Column({ type: 'decimal', default: 0 })
    price: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', unique: true })
    slug: string;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ type: 'text', array: true })
    sizes: string[];

    @Column({ type: 'text' })
    gender: string;

    @Column({ type: 'text', array: true, default: [] })
    tags: string[];


     //relation with productImage entity
    @OneToMany(() => ProductImage, (image) => image.product, {cascade: true})
    images?: ProductImage[];

    @BeforeInsert()
    checkSlugInsert() {
        this.slug = slugify(this.name);
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if (this.name) this.slug = slugify(this.name);
    }

}

