import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class LocationDto {
    @IsString()
    @IsNotEmpty()
    type: 'Point';

    @IsArray()
    @IsNotEmpty()
    @IsLongitude({ each: true })
    @IsLatitude({ each: true })
    coordinates: [number, number];
}

export class AddressDto {
    @IsString()
    @IsNotEmpty()
    streetAddress: string;

    @ValidateNested()
    @Type(() => LocationDto)
    @IsNotEmpty()
    location: LocationDto;
}
export class CreateWarehouseDto {
    @IsString()
    @IsNotEmpty()
    warehouseName: string;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsNotEmpty()
    address: AddressDto;

    @IsBoolean()
    @IsOptional()
    @IsNotEmpty()
    isDeleted: boolean;
}