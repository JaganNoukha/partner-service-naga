import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { DBServicesModule } from '../../common/repository/repository-services.module';
import { PaginationModule } from '../../common/shared/pagination/pagination.module';

@Module({
  imports: [PaginationModule, DBServicesModule],
  controllers: [WarehouseController],
  providers: [WarehouseService]
})
export class WarehouseModule {}
