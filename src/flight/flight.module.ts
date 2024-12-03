import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { UserModule } from 'src/user/user.module';
import { AirportModule } from 'src/airport/airport.module';
import { AirplaneModule } from 'src/airplane/airplane.module';
import { Airport } from 'src/airport/entities/airport.entity';
import { Airplane } from 'src/airplane/entities/airplane.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flight, Airport, Airplane]), UserModule, AirportModule, AirplaneModule],
  controllers: [FlightController],
  providers: [FlightService],
  exports: [FlightService],
})
export class FlightModule {}
