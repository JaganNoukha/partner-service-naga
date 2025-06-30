import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OutletService } from './outlet.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';

@Controller('outlets')
export class OutletController {
  constructor(private readonly outletService: OutletService) {}

  @Post()
  create(@Body() createOutletDto: CreateOutletDto) {
    return this.outletService.create(createOutletDto);
  }

  @Get()
  findAll(
    @Query('warehouseId') warehouseId: string,
    @Query('outlettypeId')outlettypeId: string,
    @Query('search') search: string,
    @Query('outletStatus') outletStatus: string,
  ) {
    return this.outletService.findAll({
      warehouseId,
     outlettypeId,
      search,
      outletStatus,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outletService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOutletDto: UpdateOutletDto) {
    return this.outletService.update(id, updateOutletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outletService.remove(id);
  }
}
