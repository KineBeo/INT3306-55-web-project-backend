import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { AdminEndpoint } from 'src/auth/decorator/admin.decorator';
import { ProtectedEndpoint } from 'src/auth/decorator/authorization.decorator';
import { BookTicketDto } from './dto/book-ticket.dto';
import { SearchTicketDto } from './dto/search-ticket.dto';

@Controller('ticket')
@ApiTags('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @AdminEndpoint('Create a ticket')
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
  search(@Query() searchTicketDto: SearchTicketDto) {
    return this.ticketService.search(searchTicketDto);
  }

  @Public()
  @Get('search-by-outbound-time')
  @ApiOperation({
    summary: 'Search tickets by outbound flight time',
    description:
      'Find tickets where outbound flight departs before or after a specified date',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns tickets matching the time criteria',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    example: '2023-12-25',
    description: 'The reference date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'before',
    required: true,
    type: Boolean,
    example: true,
    description:
      'If true, finds flights before the date. If false, finds flights after the date',
  })
  searchByOutboundTime(
    @Query('date') date: string,
    @Query('before') before: boolean,
  ) {
    return this.ticketService.searchByOutboundTime(date, before);
  }

  @Public()
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all tickets belonging to a user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all tickets belonging to the specified user.',
  })
  @ApiResponse({
    status: 404,
    description: 'No tickets found for this user.',
  })
  findAllByUserId(@Param('userId') userId: string) {
    return this.ticketService.findAllByUserId(+userId);
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

  @Patch('cancel/:id')
  @ProtectedEndpoint('Cancel a ticket')
  cancel(@Param('id') id: string) {
    return this.ticketService.cancel(+id);
  }

  @Patch('book/:id')
  @ProtectedEndpoint('Book a ticket')
  @ApiResponse({
    status: 200,
    description: 'The ticket has been successfully booked.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid booking request or ticket already booked.',
  })
  bookTicket(@Param('id') id: string, @Body() bookTicketDto: BookTicketDto) {
    return this.ticketService.bookTicket(+id, bookTicketDto);
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
