import { IsOptional, IsString } from 'class-validator';

export class SearchOutletDto {
  @IsString()
  @IsOptional()
  outletName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
 outlettypeId?: string;
} 