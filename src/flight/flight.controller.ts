import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProtectedEndpoint } from 'src/auth/decorator/authorization.decorator';
import { AdminEndpoint } from 'src/auth/decorator/admin.decorator';

@Controller('flight')
@ApiTags('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Post()
  @ProtectedEndpoint('Create a flight')
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.create(createFlightDto);
  }

  @Get()
  @AdminEndpoint('Get all flights')
  findAll() {
    return this.flightService.findAll();
  }

  @Get(':id')
  @AdminEndpoint('Find a flight by id')
  findOne(@Param('id') id: string) {
    return this.flightService.findOne(+id);
  }

  @Patch(':id')
  @AdminEndpoint('Update a flight')
  update(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightService.update(+id, updateFlightDto);
  }

  @Delete(':id')
  @AdminEndpoint('Delete a flight')
  remove(@Param('id') id: string) {
    return this.flightService.remove(+id);
  }
}
