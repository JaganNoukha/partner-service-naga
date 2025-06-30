import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OutletStatus } from 'src/common/enums/outlet.enums';
import { IOutletAddress, IVerificationDocument } from 'src/common/interfaces/outlet.interface';
import { OutletAddressDto, VerificationDocumentsDto } from '../dto/create-outlet.dto';
import { nanoid } from 'nanoid';

export type OutletDocument = Outlet & Document;

@Schema({ timestamps: true })
export class Outlet {
  @Prop({ required: true, default: () => nanoid() })
  outletId: string;

  @Prop({ required: true })
  outletName: string;

  @Prop()
 outlettypeId: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  outletImageUrl: string;

  @Prop({ default: OutletStatus.PENDING })
  outletStatus: string;

  @Prop()
  outletAddress: OutletAddressDto;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  warehouseId: string;

  @Prop()
  verificationDocuments: VerificationDocumentsDto[];
}

export const OutletSchema = SchemaFactory.createForClass(Outlet);
