import { BadRequestException, Injectable } from '@nestjs/common';
import { IMongoDBServices } from 'src/common/repository/mongodb-repository/abstract.repository';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { HttpClientService } from 'src/common/inter-service-communication/http-client.service';
import { SearchOutletDto } from './dto/search-outlet.dto';

@Injectable()
export class OutletService {
  constructor(
    private readonly mongoDBServices: IMongoDBServices,
    private readonly httpClientService: HttpClientService,
  ) {}

  private encodeFilter(key: string, value: string): string {
    return `${key}=${encodeURIComponent(value)}`;
  }

  async create(createOutletDto: CreateOutletDto) {
    const [warehouseResponse, outletResponse, outletTypeResponse] = await Promise.all([
      this.mongoDBServices.warehouse.findOne({
        warehouseId: createOutletDto.warehouseId,
      }),
      this.mongoDBServices.outlet.findOne({
        phoneNumber: createOutletDto.phoneNumber,
      }),
      this.httpClientService.get("NAGA_MDM_SERVICE", `/master/outlettype/data?filter=${this.encodeFilter("outlettypeId", createOutletDto.outlettypeId)}`, {}, true),
    ]);

    if (!outletTypeResponse) {
      throw new BadRequestException('Invalid outlet type');
    }
    if (outletResponse) {
      throw new BadRequestException('Outlet already exists');
    }
    if (!warehouseResponse) {
      throw new BadRequestException('Warehouse not found');
    }

    return this.mongoDBServices.outlet.create(createOutletDto);
  }

  async findAll(filters?: { 
    warehouseId?: string; 
   outlettypeId?: string;
    search?: string;
    outletStatus?: string;
  }) {
    const query: Record<string, any> = { isDeleted: false };
    
    if (filters?.warehouseId) {
      query.warehouseId = filters.warehouseId;
    }
    
    if (filters?.outlettypeId) {
      query.outlettypeId = filters.outlettypeId;
    }

    if (filters?.outletStatus) {
      query.outletStatus = filters.outletStatus;
    }

    if (filters?.search && typeof filters.search === 'string') {
      query.$or = [
        { outletName: { $regex: filters.search, $options: 'i' } },
        { phoneNumber: { $regex: filters.search, $options: 'i' } }
      ];
    }

    return this.mongoDBServices.outlet.find(query);
  }

  async findOne(id: string) {
    return this.mongoDBServices.outlet.findOne({
      outletId: id,
      isDeleted: false,
    });
  }

  async update(id: string, updateOutletDto: UpdateOutletDto) {
    return this.mongoDBServices.outlet.findOneAndUpdate(
      {
        outletId: id,
        isDeleted: false,
      },
      updateOutletDto,
      { new: true },
    );
  }

  async remove(id: string) {
    return this.mongoDBServices.outlet.findOneAndUpdate(
      {
        outletId: id,
        isDeleted: false,
      },
      { isDeleted: true },
      { new: true },
    );
  }

  async search(searchDto: SearchOutletDto) {
    const filter: any = { isDeleted: false };

    if (searchDto.outletName) {
      filter.outletName = { $regex: searchDto.outletName, $options: 'i' };
    }

    if (searchDto.phoneNumber) {
      filter.phoneNumber = { $regex: searchDto.phoneNumber, $options: 'i' };
    }

    if (searchDto.outlettypeId) {
      filter.outlettypeId = searchDto.outlettypeId;
    }

    return this.mongoDBServices.outlet.find(filter);
  }
}
