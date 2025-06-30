import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DocumentVerificationStatus, OutletStatus, VerificationDocumentType } from 'src/common/enums/outlet.enums';

export class OutletLocationDto {
  @IsString()
  @IsNotEmpty()
  type: 'Point';

  @IsArray()
  @IsNotEmpty()
  @IsLongitude({ each: true })
  @IsLatitude({ each: true })
  coordinates: [number, number];
}

export class OutletAddressDto {
  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @ValidateNested()
  @Type(() => OutletLocationDto)
  @IsNotEmpty()
  location: OutletLocationDto;
}

export class VerificationDocumentsDto {
  @IsNotEmpty()
  @IsEnum(VerificationDocumentType)
  documentType: VerificationDocumentType;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsOptional()
  @IsEnum(DocumentVerificationStatus)
  verificationStatus?: DocumentVerificationStatus;
}

export class CreateOutletDto {
  @IsString()
  @IsOptional()
  outletId: string;

  @IsString()
  @IsNotEmpty()
  outletName: string;

  @IsString()
  @IsNotEmpty()
 outlettypeId: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  outletImageUrl: string;

  @IsString()
  @IsOptional()
  @IsEnum(OutletStatus)
  outletStatus: string;

  @ValidateNested()
  @IsNotEmpty()
  outletAddress: OutletAddressDto;

  @IsString()
  warehouseId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VerificationDocumentsDto)
  @IsNotEmpty()
  verificationDocuments: VerificationDocumentsDto[];
}
