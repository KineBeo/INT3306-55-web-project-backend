import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportController } from './airport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './entities/airport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airport])],
  controllers: [AirportController],
  providers: [AirportService],
  exports: [AirportService],
})
export class AirportModule {}
