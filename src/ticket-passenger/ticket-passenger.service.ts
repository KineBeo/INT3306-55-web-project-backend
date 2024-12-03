import { Injectable } from '@nestjs/common';
import { CreateTicketPassengerDto } from './dto/create-ticket-passenger.dto';
import { UpdateTicketPassengerDto } from './dto/update-ticket-passenger.dto';

@Injectable()
export class TicketPassengerService {
  create(createTicketPassengerDto: CreateTicketPassengerDto) {
    return 'This action adds a new ticketPassenger';
  }

  findAll() {
    return `This action returns all ticketPassenger`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticketPassenger`;
  }

  update(id: number, updateTicketPassengerDto: UpdateTicketPassengerDto) {
    return `This action updates a #${id} ticketPassenger`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketPassenger`;
  }
}
