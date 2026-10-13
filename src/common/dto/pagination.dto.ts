import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El límite debe ser un número entero' })
    @Min(1, { message: 'El límite debe ser mayor o igual a 1' })
    @Max(100, { message: 'El límite no puede superar 100' })
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El offset debe ser un número entero' })
    @Min(0, { message: 'El offset debe ser mayor o igual a 0' })
    offset?: number;
}
