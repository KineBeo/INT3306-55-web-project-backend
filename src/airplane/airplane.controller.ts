import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AirplaneService } from './airplane.service';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminEndpoint } from 'src/auth/decorator/admin.decorator';

@Controller('airplane')
@ApiTags('airplane')  
export class AirplaneController {
  constructor(private readonly airplaneService: AirplaneService) {}

  @Post()
  @AdminEndpoint('Create an airplane')
  create(@Body() createAirplaneDto: CreateAirplaneDto) {
    return this.airplaneService.create(createAirplaneDto);
  }

  @Get()
  @AdminEndpoint('Get all airplanes')
  findAll() {
    return this.airplaneService.findAll();
  }

  @Get(':id')
  @AdminEndpoint('Find an airplane by id')
  findOne(@Param('id') id: string) {
    return this.airplaneService.findOne(+id);
  }

  @Patch(':id')
  @AdminEndpoint('Update an airplane')
  update(@Param('id') id: string, @Body() updateAirplaneDto: UpdateAirplaneDto) {
    return this.airplaneService.update(+id, updateAirplaneDto);
  }

  @Delete(':id')
  @AdminEndpoint('Delete an airplane')
  remove(@Param('id') id: string) {
    return this.airplaneService.remove(+id);
  }
}
