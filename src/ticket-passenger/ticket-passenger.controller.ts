import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketPassengerService } from './ticket-passenger.service';
import { CreateTicketPassengerDto } from './dto/create-ticket-passenger.dto';
import { UpdateTicketPassengerDto } from './dto/update-ticket-passenger.dto';

@Controller('ticket-passenger')
export class TicketPassengerController {
  constructor(private readonly ticketPassengerService: TicketPassengerService) {}

  @Post()
  create(@Body() createTicketPassengerDto: CreateTicketPassengerDto) {
    return this.ticketPassengerService.create(createTicketPassengerDto);
  }

  @Get()
  findAll() {
    return this.ticketPassengerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketPassengerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketPassengerDto: UpdateTicketPassengerDto) {
    return this.ticketPassengerService.update(+id, updateTicketPassengerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketPassengerService.remove(+id);
  }
}
