import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';


export const databaseProviders = [
    {
      imports:[ConfigModule],
      inject:[ConfigService],
      provide: 'DATA_SOURCE',
      useFactory: async (configService: ConfigService) => {
        const dataSource = new DataSource({
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [
              __dirname + '/../**/*.entity{.ts,.js}',
          ],
          logging: true
        });
  
        return dataSource.initialize();
      },
    },
  ];