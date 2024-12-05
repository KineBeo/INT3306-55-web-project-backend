import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Flight } from 'src/flight/entities/flight.entity';
import { TicketType } from 'src/enum/ticket/ticket_type';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    try {
      const { user_id, outbound_flight_id, return_flight_id } = createTicketDto;
      console.log('user_id', user_id);
      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      const outbound_flight = await this.flightRepository.findOne({
        where: { id: outbound_flight_id },
      });

      if (!outbound_flight) {
        throw new BadRequestException('Outbound flight does not exist');
      }

      const return_flight = await this.flightRepository.findOne({
        where: { id: return_flight_id },
      });

      if (!return_flight) {
        throw new BadRequestException('Return flight does not exist');
      }

      const ticket = this.ticketRepository.create({
        ...createTicketDto,
        user: user,
        outboundFlight: outbound_flight,
        returnFlight: return_flight,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.ticketRepository.save(ticket);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async search(
    ticketType: TicketType,
    departureAirportCode: string,
    arrivalAirportCode: string,
    departureDay: string,
    arrivalDay: string,
  ): Promise<Ticket[]> {
    try {
      const startOfDepartureDay = new Date(departureDay);
      startOfDepartureDay.setHours(0, 0, 0, 0);
      const endOfDepartureDay = new Date(departureDay);
      endOfDepartureDay.setHours(23, 59, 59, 999);

      const startOfArrivalDay = new Date(arrivalDay);
      startOfArrivalDay.setHours(0, 0, 0, 0);
      const endOfArrivalDay = new Date(arrivalDay);
      endOfArrivalDay.setHours(23, 59, 59, 999);

      const tickets = await this.ticketRepository
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.outboundFlight', 'outboundFlight')
        .leftJoinAndSelect(
          'outboundFlight.departure_airport',
          'departureAirport',
        )
        .leftJoinAndSelect('ticket.returnFlight', 'returnFlight')
        .leftJoinAndSelect('returnFlight.arrival_airport', 'arrivalAirport')
        .where('ticket.ticket_type = :ticketType', { ticketType })
        .andWhere('departureAirport.code = :departureAirportCode', {
          departureAirportCode,
        })
        .andWhere('arrivalAirport.code = :arrivalAirportCode', {
          arrivalAirportCode,
        })
        .andWhere(
          'outboundFlight.departure_time BETWEEN :startOfDay AND :endOfDay',
          { startOfDepartureDay, endOfDepartureDay },
        )
        .andWhere(
          'returnFlight.arrival_time BETWEEN :startOfDay AND :endOfDay',
          { startOfArrivalDay, endOfArrivalDay },
        )
        .getMany();

      return tickets;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Ticket[]> {
    try {
      const tickets = await this.ticketRepository.find();
      if (!tickets || tickets.length === 0) {
        throw new BadRequestException('No ticket found');
      }

      return tickets;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number): Promise<Ticket> {
    try {
      const ticket = await this.ticketRepository.findOne({ where: { id } });
      if (!ticket) {
        throw new BadRequestException(`Ticket with id ${id} not found`);
      }
      return ticket;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    try {
      const ticket = await this.ticketRepository.findOne({ where: { id } });
      if (!ticket) {
        throw new BadRequestException(`Ticket with id ${id} not found`);
      }
      const updatedTicket = Object.assign(ticket, updateTicketDto, {
        updated_at: new Date(),
      });
      return await this.ticketRepository.save(updatedTicket);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const ticket = await this.ticketRepository.findOne({ where: { id } });
      if (!ticket) {
        throw new BadRequestException(`Ticket with id ${id} not found`);
      }
      await this.ticketRepository.remove(ticket);
      return { message: 'Ticket deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
