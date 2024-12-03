import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Airport } from './entities/airport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport)
    private airportRepository: Repository<Airport>,
  ) {}

  /**
   * * ADMIN: Create a new airport
   * @param createAirportDto
   * @returns
   */
  async create(createAirportDto: CreateAirportDto): Promise<Airport> {
    try {
      const existingAirport = await this.airportRepository.findOne({
        where: { code: createAirportDto.code },
      });

      if (existingAirport) {
        throw new BadRequestException('Airport with this code already exists');
      }

      const newAirport = this.airportRepository.create({
        ...createAirportDto,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return this.airportRepository.save(newAirport);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * * ADMIN: Get all airports
   * @returns Airport[]
   */
  async findAll(): Promise<Airport[]> {
    try {
      const airports = await this.airportRepository.find();
      if (!airports) {
        throw new NotFoundException('No airports found');
      }

      return airports;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * * ADMIN: Get a single airport by ID
   * @param id number
   * @returns Airport
   */
  async findOne(id: number): Promise<Airport> {
    try {
      const airport = await this.airportRepository.findOne({ where: { id } });
      if (!airport) {
        throw new NotFoundException(`Airport with id ${id} not found`);
      }
      return airport;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * * ADMIN: Update an airport by ID
   * @param id number
   * @param updateAirportDto UpdateAirportDto
   * @returns Airport
   */
  async update(
    id: number,
    updateAirportDto: UpdateAirportDto,
  ): Promise<Airport> {
    try {
      const airport = await this.findOne(id);
      if (!airport) {
        throw new NotFoundException(`Airport with id ${id} not found`);
      }
      const updatedAirport = Object.assign(airport, updateAirportDto, {
        updated_at: new Date(),
      });
      return this.airportRepository.save(updatedAirport);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * * ADMIN: Delete an airport by ID
   * @param id number
   * @returns { message: string }
   */
  async remove(id: number): Promise<{ message: string }> {
    try {
      const airport = await this.findOne(id);
      if (!airport) {
        throw new NotFoundException(`Airport with id ${id} not found`);
      }
      await this.airportRepository.remove(airport);
      return { message: `Airport with id ${id} deleted successfully` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
