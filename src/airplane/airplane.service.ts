import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';
import { Airplane } from './entities/airplane.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirplaneStatus } from 'src/enum/airplane/airplane_status';

@Injectable()
export class AirplaneService {
  constructor(
    @InjectRepository(Airplane)
    private airplaneRepository: Repository<Airplane>,
  ) {}

  /**
   * * Admin: Create an airplane
   * @param createAirplaneDto
   * @returns Airplane
   */
  async create(createAirplaneDto: CreateAirplaneDto): Promise<Airplane> {
    try {
      const existingAirplane = await this.airplaneRepository.findOne({
        where: { registration_number: createAirplaneDto.registration_number },
      });

      if (existingAirplane) {
        throw new BadRequestException(
          'Airplane with this registration number already exists',
        );
      }

      const totalSeats =
        createAirplaneDto.economy_seats +
        createAirplaneDto.business_seats +
        createAirplaneDto.first_class_seats;
      if (createAirplaneDto.capacity !== totalSeats) {
        throw new BadRequestException(
          'Capacity must be equal to the total number of economy, business, and first class seats',
        );
      }

      const airplane = this.airplaneRepository.create({
        ...createAirplaneDto,
        status: AirplaneStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return this.airplaneRepository.save(airplane);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * * Admin: Get all airplanes
   * @returns Airplane[]
   */
  async findAll(): Promise<Airplane[]> {
    try {
      const airplanes = await this.airplaneRepository.find();
      if (!airplanes) {
        throw new NotFoundException('No airplanes found');
      }

      return airplanes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * * Admin: Find an airplane by id
   * @param id
   * @returns Airplane
   */
  async findOne(id: number): Promise<Airplane> {
    try {
      const airplane = await this.airplaneRepository.findOne({
        where: { id },
        relations: ['flight'],
      });
      if (!airplane) {
        throw new NotFoundException(`Airplane with id ${id} not found`);
      }
      return airplane;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * * Admin: Update an airplane
   * @param id
   * @param updateAirplaneDto
   * @returns Airplane
   */
  async update(
    id: number,
    updateAirplaneDto: UpdateAirplaneDto,
  ): Promise<Airplane> {
    try {
      const airplane = await this.airplaneRepository.findOne({ where: { id } });
      if (!airplane) {
        throw new NotFoundException(`Airplane with id ${id} not found`);
      }

      if (
        updateAirplaneDto.economy_seats !== undefined ||
        updateAirplaneDto.business_seats !== undefined ||
        updateAirplaneDto.first_class_seats !== undefined
      ) {
        const totalSeats =
          (updateAirplaneDto.economy_seats ?? airplane.economy_seats) +
          (updateAirplaneDto.business_seats ?? airplane.business_seats) +
          (updateAirplaneDto.first_class_seats ?? airplane.first_class_seats);
        if (updateAirplaneDto.capacity !== totalSeats) {
          throw new BadRequestException(
            'Capacity must be equal to the total number of economy, business, and first class seats',
          );
        }
      }

      const updatedAirplane = Object.assign(airplane, {
        ...updateAirplaneDto,
        updated_at: new Date(),
      });

      return this.airplaneRepository.save(updatedAirplane);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * * Admin: Remove an airplane
   * @param id
   * @returns { message: string }
   */
  async remove(id: number): Promise<{ message: string }> {
    try {
      const airplane = await this.airplaneRepository.findOne({ where: { id } });
      if (!airplane) {
        throw new NotFoundException(`Airplane with id ${id} not found`);
      }

      await this.airplaneRepository.remove(airplane);
      return { message: `Airplane with id ${id} has been removed` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
