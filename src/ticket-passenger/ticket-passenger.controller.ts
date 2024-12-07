import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketPassengerService } from './ticket-passenger.service';
import { CreateTicketPassengerDto } from './dto/create-ticket-passenger.dto';
import { UpdateTicketPassengerDto } from './dto/update-ticket-passenger.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminEndpoint } from 'src/auth/decorator/admin.decorator';
import { ProtectedEndpoint } from 'src/auth/decorator/authorization.decorator';

@Controller('ticket-passenger')
@ApiTags('ticket-passenger')
export class TicketPassengerController {
  constructor(
    private readonly ticketPassengerService: TicketPassengerService,
  ) {}

  @ProtectedEndpoint('Create a ticket-passenger', 201, 'The ticket-passenger has been successfully created.')
  @Post()
  create(@Body() createTicketPassengerDto: CreateTicketPassengerDto) {
    return this.ticketPassengerService.create(createTicketPassengerDto);
  }

  @Get()
  @AdminEndpoint('Get all ticket-passengers')
  findAll() {
    return this.ticketPassengerService.findAll();
  }

  @Get(':id')
  @AdminEndpoint('Find a ticket-passenger by id')
  findOne(@Param('id') id: string) {
    return this.ticketPassengerService.findOne(+id);
  }

  @Patch(':id')
  @AdminEndpoint('Update a ticket-passenger')
  update(
    @Param('id') id: string,
    @Body() updateTicketPassengerDto: UpdateTicketPassengerDto,
  ) {
    return this.ticketPassengerService.update(+id, updateTicketPassengerDto);
  }

  @Delete(':id')
  @AdminEndpoint('Delete a ticket-passenger')
  remove(@Param('id') id: string) {
    return this.ticketPassengerService.remove(+id);
  }
}
