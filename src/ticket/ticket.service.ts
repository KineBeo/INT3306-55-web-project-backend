import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Flight } from 'src/flight/entities/flight.entity';
import { TicketType } from 'src/enum/ticket/ticket_type';
import { BookingStatus } from 'src/enum/ticket/booking_status';
import { BookTicketDto } from './dto/book-ticket.dto';

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
      const {
        user_id,
        outbound_flight_id,
        return_flight_id,
        base_price,
        total_passengers,
      } = createTicketDto;
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

      // Check if outbound flight's arrival date is before return flight's departure date
      if (outbound_flight.arrival_time >= return_flight.departure_time) {
        throw new BadRequestException(
          'Outbound flight arrival time must be before return flight departure time',
        );
      }

      if (outbound_flight.departure_airport !== return_flight.arrival_airport) {
        throw new BadRequestException(
          'Outbound flight departure airport must be the same as return flight arrival airport',
        );
      }

      if (outbound_flight.arrival_airport !== return_flight.departure_airport) {
        throw new BadRequestException(
          'Outbound flight arrival airport must be the same as return flight departure airport',
        );
      }

      // Calculate ticket prices
      const basePrice = parseFloat(base_price);
      const passengers = total_passengers || 1;

      const outbound_ticket_price = (basePrice * passengers).toString();
      const return_ticket_price = return_flight_id
        ? (basePrice * passengers).toString()
        : '0';
      const total_price = (
        parseFloat(outbound_ticket_price) + parseFloat(return_ticket_price)
      ).toString();

      const ticket = this.ticketRepository.create({
        ...createTicketDto,
        user: user,
        outboundFlight: outbound_flight,
        returnFlight: return_flight,
        outbound_ticket_price,
        return_ticket_price,
        total_price,
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
    outboundDay: string,
    returnDay?: string,
  ): Promise<Ticket[]> {
    try {
      const startOfOutboundDay = new Date(outboundDay);
      startOfOutboundDay.setHours(0, 0, 0, 0);
      const endOfOutboundDay = new Date(outboundDay);
      endOfOutboundDay.setHours(23, 59, 59, 999);

      let ticketsQuery = this.ticketRepository
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.outboundFlight', 'outboundFlight')
        .leftJoinAndSelect(
          'outboundFlight.departure_airport',
          'outboundDepartureAirport',
        )
        .leftJoinAndSelect(
          'outboundFlight.arrival_airport',
          'outboundArrivalAirport',
        )
        .leftJoinAndSelect('ticket.returnFlight', 'returnFlight')
        .leftJoinAndSelect(
          'returnFlight.departure_airport',
          'returnDepartureAirport',
        )
        .leftJoinAndSelect(
          'returnFlight.arrival_airport',
          'returnArrivalAirport',
        )
        .where('ticket.ticket_type = :ticketType', { ticketType })
        .andWhere('outboundDepartureAirport.code = :departureAirportCode', {
          departureAirportCode,
        })
        .andWhere('outboundArrivalAirport.code = :arrivalAirportCode', {
          arrivalAirportCode,
        })
        .andWhere(
          'outboundFlight.departure_time BETWEEN :startOfOutboundDay AND :endOfOutboundDay',
          { startOfOutboundDay, endOfOutboundDay },
        );

      if (ticketType === TicketType.ROUND_TRIP && returnDay) {
        const startOfReturnDay = new Date(returnDay);
        startOfReturnDay.setHours(0, 0, 0, 0);
        const endOfReturnDay = new Date(returnDay);
        endOfReturnDay.setHours(23, 59, 59, 999);

        ticketsQuery = ticketsQuery.andWhere(
          'returnFlight.departure_time BETWEEN :startOfReturnDay AND :endOfReturnDay',
          { startOfReturnDay, endOfReturnDay },
        );
      }

      const tickets = await ticketsQuery.getMany();
      return tickets;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async searchByOutboundTime(date: string, before: boolean): Promise<Ticket[]> {
    try {
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);

      const ticketsQuery = this.ticketRepository
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.outboundFlight', 'outboundFlight')
        .where(
          before
            ? 'outboundFlight.departure_time <= :compareDate'
            : 'outboundFlight.departure_time >= :compareDate',
          { compareDate },
        );

      const tickets = await ticketsQuery.getMany();
      if (!tickets || tickets.length === 0) {
        throw new BadRequestException('No tickets found');
      }

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

  async cancel(id: number): Promise<Ticket> {
    try {
      const ticket = await this.ticketRepository.findOne({ where: { id } });
      if (!ticket) {
        throw new BadRequestException(`Ticket with id ${id} not found`);
      }

      ticket.booking_status = BookingStatus.CANCELLED;
      ticket.updated_at = new Date();
      return await this.ticketRepository.save(ticket);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async bookTicket(id: number, bookTicketDto: BookTicketDto): Promise<Ticket> {
    try {
      const ticket = await this.ticketRepository.findOne({ where: { id } });
      if (!ticket) {
        throw new BadRequestException(`Ticket with id ${id} not found`);
      }

      if (ticket.booking_status === BookingStatus.CONFIRMED) {
        throw new BadRequestException('Ticket is already booked');
      }

      if (ticket.booking_status === BookingStatus.CANCELLED) {
        throw new BadRequestException('Cannot book a cancelled ticket');
      }

      const updatedTicket = {
        ...ticket,
        booking_status: BookingStatus.CONFIRMED,
        booking_date: new Date(),
        booking_seat_code: bookTicketDto.booking_seat_code,
        total_passengers: bookTicketDto.total_passengers,
        updated_at: new Date(),
      };

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

  async findAllByUserId(userId: number): Promise<Ticket[]> {
    try {
      const tickets = await this.ticketRepository.find({
        where: { user: { id: userId } },
        relations: [
          'outboundFlight',
          'returnFlight',
          'user',
          'ticketPassengers',
          'outboundFlight.departure_airport',
          'outboundFlight.arrival_airport',
          'returnFlight.departure_airport',
          'returnFlight.arrival_airport',
        ],
        order: {
          created_at: 'DESC',
        },
      });

      if (!tickets || tickets.length === 0) {
        throw new BadRequestException(`No tickets found for user ${userId}`);
      }

      return tickets;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
