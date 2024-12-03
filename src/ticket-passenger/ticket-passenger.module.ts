import { Module } from '@nestjs/common';
import { TicketPassengerService } from './ticket-passenger.service';
import { TicketPassengerController } from './ticket-passenger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketPassenger } from './entities/ticket-passenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketPassenger])],
  controllers: [TicketPassengerController],
  providers: [TicketPassengerService],
  exports: [TicketPassengerService],
})
export class TicketPassengerModule {}
