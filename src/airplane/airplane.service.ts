import { Injectable } from '@nestjs/common';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';

@Injectable()
export class AirplaneService {
  create(createAirplaneDto: CreateAirplaneDto) {
    return 'This action adds a new airplane';
  }

  findAll() {
    return `This action returns all airplane`;
  }

  findOne(id: number) {
    return `This action returns a #${id} airplane`;
  }

  update(id: number, updateAirplaneDto: UpdateAirplaneDto) {
    return `This action updates a #${id} airplane`;
  }

  remove(id: number) {
    return `This action removes a #${id} airplane`;
  }
}
