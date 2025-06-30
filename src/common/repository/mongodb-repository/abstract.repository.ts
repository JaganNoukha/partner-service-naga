import { Outlet, OutletDocument } from 'src/modules/outlet/entities/outlet.entity';
import { IWarehouse } from '../../../common/interfaces/warehouse-interface';
import { Warehouse, WarehouseDocument } from '../../../modules/warehouse/entity/warehouse.entity';
import { IMongoRepository } from './repository.abstract';
import { IOutlet } from 'src/common/interfaces/outlet.interface';

export abstract class IMongoDBServices {
    abstract warehouse: IMongoRepository<Warehouse, IWarehouse, WarehouseDocument>;
    abstract outlet: IMongoRepository<Outlet, IOutlet, OutletDocument>;
}
  