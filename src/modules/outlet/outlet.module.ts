import { Module } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletController } from './outlet.controller';
import { MongoDBServicesModule } from 'src/common/repository/mongodb-repository/repository.module';
import { HttpClientModule } from 'src/common/inter-service-communication/http-client.module';

@Module({
  imports: [MongoDBServicesModule, HttpClientModule],
  controllers: [OutletController],
  providers: [OutletService],
})
export class OutletModule {}
