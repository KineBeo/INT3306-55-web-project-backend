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
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('airport')
@ApiTags('airport')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Post()
  @AdminEndpoint('Create an airport')
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportService.create(createAirportDto);
  }

  @Public({
    summary: 'Get all airports',
    description: 'Returns a list of all airports',
    status: 200
  })
  @Get()
  findAll() {
    return this.airportService.findAll();
  }

  @Public({
    summary: 'Find an airport by id',
    description: 'Returns a single airport by its ID',
    status: 200
  })
  @Get(':id')
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
