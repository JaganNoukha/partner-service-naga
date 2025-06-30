import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AddressDto } from "../dto/warehouse.dto";
import { IWarehouse } from "../../../common/interfaces/warehouse-interface";
import { CollectionNames } from "../../../common/constants/service-common.constants";

export type WarehouseDocument = Warehouse & Document;
@Schema({ collection: CollectionNames.WAREHOUSE })
export class Warehouse extends Document implements IWarehouse {
    @Prop({ required: true, unique: true })
    warehouseId: string;

    @Prop({ required: true })
    warehouseName: string;

    @Prop({ required: true })
    address: AddressDto;

    @Prop({ required: true, default: false })
    isDeleted: boolean;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);