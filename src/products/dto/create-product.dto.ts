import { IsArray, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
    @IsString({ message: 'El nombre del producto debe ser un texto' })
    @MaxLength(60, { message: 'El nombre del producto no puede superar los 60 caracteres' })
    name: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales' })
    @IsPositive({ message: 'El precio debe ser un número positivo' })
    price?: number;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto' })
    description?: string;

    @IsOptional()
    @IsInt({ message: 'El stock debe ser un número entero' })
    @IsPositive({ message: 'El stock debe ser un número positivo' })
    stock?: number;

    @IsArray({ message: 'Las tallas deben ser una lista' })
    @IsString({ each: true, message: 'Cada talla debe ser un texto' })
    sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'], { message: 'El género debe ser: men, women, kid o unisex' })
    gender: string;

    @IsOptional()
    @IsArray({ message: 'Los tags deben de ser una lista,'})
    @IsString({each: true,  message: 'Cada tag debe de ser un string'})
    tags?: string[];


    @IsOptional()
    @IsArray({ message: 'Las imgs deben de ser una lista,'})
    @IsString({each: true,  message: 'Cada img debe de ser un string'})
    images?: string[];

}
