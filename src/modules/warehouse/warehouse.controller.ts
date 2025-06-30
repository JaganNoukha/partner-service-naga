import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/warehouse.dto';
import { FetchDto } from 'src/common/shared/pagination/dto/fetch.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get(':warehouseId')
  async findById(@Param('warehouseId') warehouseId: string) {
    return this.warehouseService.findById(warehouseId);
  }

  @Get()
  findAllWarehouse(@Query() fetchDto: FetchDto) {
    const { skip, limit, filter, deleted } = fetchDto;

    const parsedFilter: Record<string, any> = (() => {
      try {
        const parsed = JSON.parse(filter || '{}');
        return {
          ...parsed,
          isDeleted: deleted ? true : { $in: [null, false] },
        };
      } catch {
        return { isDeleted: deleted ? true : { $in: [null, false] } };
      }
    })();

    return this.warehouseService.findAllWarehouse(skip, limit, parsedFilter);
  }

  @Post()
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Patch(':warehouseId')
  async update(
    @Param('warehouseId') warehouseId: string,
    @Body() updateWarehouseDto: Partial<CreateWarehouseDto>,
  ) {
    return this.warehouseService.update(warehouseId, updateWarehouseDto);
  }

  @Delete(':id')
  async delete(@Param('warehouseId') warehouseId: string) {
    return this.warehouseService.delete(warehouseId);
  }

  @Post('by-ids')
  async findByIds(@Body('warehouseIds') warehouseIds: string[]) {
    return this.warehouseService.findByIds(warehouseIds);
  }
}
