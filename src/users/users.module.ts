import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersProviders } from './service/users.provider';
import { UsersService } from './service/users.service';

import { UsersController } from './users.controller';
import { Helper } from '../app.helper';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders, Helper],
  exports:[UsersService],
})
export class UsersModule {}
