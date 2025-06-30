import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IMongoDBServices } from './abstract.repository';
import { MongoDBServices } from './repository.service';
import { Warehouse, WarehouseSchema } from '../../../modules/warehouse/entity/warehouse.entity';
import { Outlet, OutletSchema } from 'src/modules/outlet/entities/outlet.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Warehouse.name, schema: WarehouseSchema },
    { name: Outlet.name, schema: OutletSchema }
  ])],
  providers: [
    {
      provide: IMongoDBServices,
      useClass: MongoDBServices,
    },
  ],
  exports: [IMongoDBServices],
})

export class MongoDBServicesModule {
  constructor() {
    console.log('MongoDBServicesModule loaded');
  }
}
