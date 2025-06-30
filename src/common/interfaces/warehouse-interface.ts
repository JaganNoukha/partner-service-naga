import { AddressDto } from 'src/modules/warehouse/dto/warehouse.dto';

export interface IWarehouse {
  warehouseId: string;
  warehouseName: string;
  address: AddressDto;
  isDeleted: boolean;
}
