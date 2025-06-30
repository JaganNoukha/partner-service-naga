import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientModule } from './common/inter-service-communication/http-client.module';
import { AppLoggerService } from './common/logger/logger.service';
import { RequestContextService } from './common/middleware/request.service';
import { TraceContextMiddleware } from './common/middleware/trace.middleware';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { OutletModule } from './modules/outlet/outlet.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      minPoolSize: 10,
      maxPoolSize: 100,
      ssl: true,
      tls: true,
      retryWrites: true,
      w: 'majority'
    }),
    HttpModule,
    HttpClientModule,
    WarehouseModule,
    OutletModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    AppLoggerService, 
    RequestContextService
  ],
  exports: [AppLoggerService, RequestContextService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceContextMiddleware).forRoutes('*');
  }
}
