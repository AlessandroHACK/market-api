import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: Number(configService.get<string>('POSTGRES_PORT', '5432')),
    database: configService.get<string>('POSTGRES_DB'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
    logging: false,
    autoLoadEntities: true,
    synchronize: true, //update chanches in db
});
