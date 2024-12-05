import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { AdminEndpoint } from 'src/auth/decorator/admin.decorator';
import { TicketType } from 'src/enum/ticket/ticket_type';

@Controller('ticket')
@ApiTags('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a ticket' })
  @ApiResponse({
    status: 201,
    description: 'The ticket has been successfully created.',
  })
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search tickets' })
  @ApiResponse({
    status: 200,
    description: 'The tickets have been successfully retrieved.',
  })
  @ApiQuery({
    name: 'ticket_type',
    example: 'economy',
    description: 'Type of the ticket',
  })
  @ApiQuery({
    name: 'departure_airport_code',
    example: 'JFK',
    description: 'Code of the departure airport',
  })
  @ApiQuery({
    name: 'arrival_airport_code',
    example: 'LAX',
    description: 'Code of the arrival airport',
  })
  @ApiQuery({
    name: 'departure_day',
    example: '2023-10-01',
    description: 'Departure date of the flight (day, month, and year)',
  })
  @ApiQuery({
    name: 'arrival_day',
    example: '2023-10-01',
    description: 'Arrival date of the flight (day, month, and year)',
  })
  search(
    @Param('ticket_type') ticketType: TicketType,
    @Param('departure_airport_code') departureAirportCode: string,
    @Param('arrival_airport_code') arrivalAirportCode: string,
    @Param('departure_time') departureDay: string,
    @Param('arrival_time') arrivalDay: string,
  ) {
    return this.ticketService.search(
      ticketType,
      departureAirportCode,
      arrivalAirportCode,
      departureDay,
      arrivalDay,
    );
  }

  @Get()
  @AdminEndpoint('Get all tickets')
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  @AdminEndpoint('Find a ticket by id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }

  @Patch(':id')
  @AdminEndpoint('Update a ticket')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  @AdminEndpoint('Delete a ticket')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
