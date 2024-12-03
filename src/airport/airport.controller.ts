import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AirportService } from './airport.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminEndpoint } from 'src/auth/decorator/admin.decorator';

@Controller('airport')
@ApiTags('airport')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Post()
  @AdminEndpoint('Create an airport')
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportService.create(createAirportDto);
  }

  @Get()
  @AdminEndpoint('Get all airports')
  findAll() {
    return this.airportService.findAll();
  }

  @Get(':id')
  @AdminEndpoint('Find an airport by id')
  findOne(@Param('id') id: string) {
    return this.airportService.findOne(+id);
  }

  @Patch(':id')
  @AdminEndpoint('Update an airport')
  update(@Param('id') id: string, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportService.update(+id, updateAirportDto);
  }

  @Delete(':id')
  @AdminEndpoint('Delete an airport')
  remove(@Param('id') id: string) {
    return this.airportService.remove(+id);
  }
}
