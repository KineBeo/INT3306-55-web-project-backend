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
import { SearchTicketDto } from './dto/search-ticket.dto';
import { ForbiddenException } from '@nestjs/common';
import { Request } from '@nestjs/common';

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

  @Public({
    summary: 'Search tickets',
    description: 'The tickets have been successfully retrieved.',
    status: 200,
  })
  @Get('search')
  search(@Query() searchTicketDto: SearchTicketDto) {
    return this.ticketService.search(searchTicketDto);
  }

  @ProtectedEndpoint(
    'Get all tickets belonging to a user. The user can only access their own tickets',
  )
  @Get('user/:userId')
  findAllByUserId(@Param('userId') userId: string, @Request() req) {
    if (Number(req.user.sub) !== Number(userId)) {
      throw new ForbiddenException('You can only access your own tickets');
    }
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
  book(@Param('id') id: string, @Request() req) {
    return this.ticketService.book(+id, req);
  }

  @Patch('check-in/:id')
  @ProtectedEndpoint('Check-in a ticket')
  @ApiOperation({ summary: 'Check-in a ticket' })
  @ApiResponse({
    status: 200,
    description: 'The ticket has been successfully checked in.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid check-in request or ticket already checked in.',
  })
  checkIn(@Param('id') id: string) {
    return this.ticketService.checkIn(+id);
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
