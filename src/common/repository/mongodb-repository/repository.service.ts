import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoRepository } from './repository';
import { IMongoRepository } from './repository.abstract';
import { IWarehouse } from '../../../common/interfaces/warehouse-interface';
import { Warehouse, WarehouseDocument } from '../../../modules/warehouse/entity/warehouse.entity';
import { Outlet, OutletDocument } from 'src/modules/outlet/entities/outlet.entity';
import { IOutlet } from 'src/common/interfaces/outlet.interface';
import { IMongoDBServices } from './abstract.repository';

@Injectable()
export class MongoDBServices implements IMongoDBServices {
  warehouse: IMongoRepository<Warehouse, IWarehouse, WarehouseDocument>;
  outlet: IMongoRepository<OutletDocument, IOutlet, OutletDocument>;

  constructor(
    @InjectModel(Warehouse.name)
    private WarehouseRepository: Model<WarehouseDocument>,
    @InjectModel(Outlet.name)
    private OutletRepository: Model<OutletDocument>
  ) {
    console.log('MongoDBServices loaded');
  }

  onApplicationBootstrap() {
    this.warehouse = new MongoRepository<Warehouse, IWarehouse, WarehouseDocument>(
      this.WarehouseRepository,
    );
    this.outlet = new MongoRepository<OutletDocument, IOutlet, OutletDocument>(
      this.OutletRepository,
    );
    console.log('<== Mongo DB repositories got initialised ==>');
  }
}
