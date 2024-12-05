import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Airplane } from 'src/airplane/entities/airplane.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { In, Repository } from 'typeorm';
import { FlightStatus } from 'src/enum/flight/flight_status';
import { Airport } from 'src/airport/entities/airport.entity';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    @InjectRepository(Airplane)
    private airplaneRepository: Repository<Airplane>,
    @InjectRepository(Airport)
    private airportRepository: Repository<Airport>,
  ) {}

  /**
   *
   * @param createFlightDto
   * @returns Flight
   */
  async create(createFlightDto: CreateFlightDto): Promise<Flight> {
    try {
      const existingFlight = await this.flightRepository.findOne({
        where: { flight_number: createFlightDto.flight_number },
      });

      if (existingFlight) {
        throw new BadRequestException('Flight number already exists');
      }

      const { departure_airport_id, arrival_airport_id, airplane_id } =
        createFlightDto;
      const departure_airport = await this.airportRepository.findOne({
        where: { id: departure_airport_id },
      });
      if (!departure_airport) {
        throw new BadRequestException('Departure airport not found');
      }
      const arrival_airport = await this.airportRepository.findOne({
        where: { id: arrival_airport_id },
      });
      if (!arrival_airport) {
        throw new BadRequestException('Arrival airport not found');
      }
      const airplane = await this.airplaneRepository.findOne({
        where: { id: airplane_id },
      });
      if (!airplane) {
        throw new BadRequestException('Airplane not found');
      }

      const newFlight = this.flightRepository.create({
        departure_airport: departure_airport,
        arrival_airport: arrival_airport,
        airplane: airplane,
        ...createFlightDto,
        status: FlightStatus.SCHEDULED,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.flightRepository.save(newFlight);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   *
   * @returns Flight[]
   */
  async findAll(): Promise<Flight[]> {
    try {
      const flights = await this.flightRepository.find();
      if (!flights) {
        throw new NotFoundException('No flights found');
      }

      return flights;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   *
   * @param id
   * @returns Flight
   */
  async findOne(id: number): Promise<Flight> {
    try {
      const flight = await this.flightRepository.findOne({ where: { id } });
      if (!flight) {
        throw new NotFoundException(`Flight with ID ${id} not found`);
      }
      return flight;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   *
   * @param id
   * @param updateFlightDto
   * @returns Flight
   */
  async update(id: number, updateFlightDto: UpdateFlightDto): Promise<Flight> {
    try {
      const flight = await this.flightRepository.findOne({ where: { id } });
      if (!flight) {
        throw new NotFoundException(`Flight with ID ${id} not found`);
      }

      const updatedFlight = Object.assign(flight, updateFlightDto, {
        updated_at: new Date(),
      });

      return await this.flightRepository.save(updatedFlight);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   *
   * @param id
   * @returns message
   */
  async remove(id: number): Promise<{ message: string }> {
    try {
      const flight = await this.flightRepository.findOne({ where: { id } });
      if (!flight) {
        throw new NotFoundException(`Flight with ID ${id} not found`);
      }

      await this.flightRepository.remove(flight);
      return { message: `Flight with ID ${id} has been deleted` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
