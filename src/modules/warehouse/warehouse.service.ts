import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/warehouse.dto';
import { PaginationService } from 'src/common/shared/pagination/pagination.service';
import { IMongoDBServices } from 'src/common/repository/mongodb-repository/abstract.repository';
import { customAlphabet } from 'nanoid';

@Injectable()
export class WarehouseService {
  private readonly nanoid = customAlphabet(
    '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    16,
  );

  constructor(
    private readonly paginationService: PaginationService,
    private readonly dbServices: IMongoDBServices,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    console.log(createWarehouseDto);
    try {
      return await this.dbServices.warehouse.create({
        ...createWarehouseDto,
        warehouseId: this.nanoid(),
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(warehouseId: string) {
    try {
      const data = await this.dbServices.warehouse.findOne({ warehouseId });

      if (!data) {
        throw new NotFoundException(
          `Warehouse with ID ${warehouseId} not found`,
        );
      }

      return data;
    } catch (error) {
      throw new BadRequestException('Failed to fetch warehouse data');
    }
  }

  async findAllWarehouse(skip: number, limit: number, parsedFilter: any) {
    return await this.paginationService.findAndPaginate(
      this.dbServices.warehouse,
      'Warehouse',
      {
        skip,
        limit,
        filter: parsedFilter,
      },
    );
  }

  async update(
    warehouseId: string,
    updateWarehouseDto: Partial<CreateWarehouseDto>,
  ) {
    try {
      return await this.dbServices.warehouse.findOneAndUpdate(
        { warehouseId },
        { $set: updateWarehouseDto },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(warehouseId: string) {
    try {
      return await this.dbServices.warehouse.findOneAndUpdate(
        { warehouseId },
        { $set: { isDeleted: true } },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findByIds(warehouseIds: string[]) {
    return await this.dbServices.warehouse.find({ warehouseId: { $in: warehouseIds } });
  } 
}
