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
import { SearchTicketDto } from './dto/search-ticket.dto';

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
        total_passengers,
        ticket_type,
      } = createTicketDto;

      // Validate owner (optional)
      let user = null;
      if (user_id) {
        user = await this.userRepository.findOne({
          where: { id: user_id },
        });
        if (!user) {
          throw new BadRequestException('User does not exist');
        }
      }

      // Validate outbound flight
      const outbound_flight = await this.validateFlight(
        outbound_flight_id,
        'Outbound flight does not exist',
      );

      // Validate return flight (optional)
      let return_flight = null;
      if (ticket_type === TicketType.ROUND_TRIP) {
        if (!return_flight_id) {
          throw new BadRequestException(
            'Return flight ID is required for round trip tickets',
          );
        }

        return_flight = await this.validateFlight(
          return_flight_id,
          'Return flight does not exist',
        );

        await this.validateRelationship(outbound_flight, return_flight);
      }

      // Calculate ticket prices
      const numPassengers = total_passengers || 1;
      const outboundBasePrice = outbound_flight.base_price;
      const returnBasePrice = return_flight ? return_flight.base_price : null;

      const { outbound_ticket_price, return_ticket_price, total_price } =
        await this.calculateTicketPrices(
          outboundBasePrice,
          returnBasePrice,
          numPassengers,
        );

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

  async search(searchTicketDto: SearchTicketDto): Promise<Ticket[]> {
    try {
      const {
        ticket_type,
        departure_airport_code,
        arrival_airport_code,
        outbound_day,
        return_day,
      } = searchTicketDto;

      const startOfOutboundDay = new Date(outbound_day);
      startOfOutboundDay.setHours(0, 0, 0, 0);
      const endOfOutboundDay = new Date(outbound_day);
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
        .where('ticket.ticket_type = :ticket_type', { ticket_type })
        .andWhere('outboundDepartureAirport.code = :departure_airport_code', {
          departure_airport_code,
        })
        .andWhere('outboundArrivalAirport.code = :arrival_airport_code', {
          arrival_airport_code,
        })
        .andWhere(
          'outboundFlight.departure_time BETWEEN :startOfOutboundDay AND :endOfOutboundDay',
          { startOfOutboundDay, endOfOutboundDay },
        )
        .andWhere('ticket.user IS NULL')
        .andWhere('ticket.booking_date IS NULL');

      if (ticket_type === TicketType.ROUND_TRIP && return_day) {
        const startOfReturnDay = new Date(return_day);
        startOfReturnDay.setHours(0, 0, 0, 0);
        const endOfReturnDay = new Date(return_day);
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

  async findAll(): Promise<Ticket[]> {
    try {
      const tickets = await this.ticketRepository.find({
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
      });
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
      const ticket = await this.ticketRepository.findOne({
        where: { id },
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
      });
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

      if (updateTicketDto.outbound_flight_id) {
        ticket.outboundFlight = await this.validateFlight(
          updateTicketDto.outbound_flight_id,
          'Outbound flight does not exist',
        );
      }

      if (updateTicketDto.ticket_type) {
        ticket.ticket_type = updateTicketDto.ticket_type;
      }

      if (updateTicketDto.return_flight_id) {
        if (ticket.ticket_type !== TicketType.ROUND_TRIP) {
          throw new BadRequestException(
            'Return flight can only be updated for round trip tickets',
          );
        }

        ticket.returnFlight = await this.validateFlight(
          updateTicketDto.return_flight_id,
          'Return flight does not exist',
        );

        await this.validateRelationship(
          ticket.outboundFlight,
          ticket.returnFlight,
        );
      }

      if (updateTicketDto.total_passengers) {
        ticket.total_passengers = updateTicketDto.total_passengers;
      }

      const { outbound_ticket_price, return_ticket_price, total_price } =
        await this.calculateTicketPrices(
          ticket.outboundFlight.base_price,
          ticket.returnFlight ? ticket.returnFlight.base_price : null,
          ticket.total_passengers,
        );

      ticket.outbound_ticket_price = outbound_ticket_price;
      ticket.return_ticket_price = return_ticket_price;
      ticket.total_price = total_price;

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

  async book(id: number, req: any): Promise<Ticket> {
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

      if (!ticket.ticketPassengers) {
        throw new BadRequestException('Cannot book a ticket without passengers');
      }

      const bookedTicket = {
        ...ticket,
        user_id: Number(req.user.sub),
        total_passengers: ticket.ticketPassengers.length,
        booking_date: new Date(),
        updated_at: new Date(),
      };

      return await this.ticketRepository.save(bookedTicket);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkIn(id: number): Promise<Ticket> {
    try {
      const ticket = await this.ticketRepository.findOne({ where: { id } });
      if (!ticket) {
        throw new BadRequestException(`Ticket with id ${id} not found`);
      }

      if (ticket.booking_status === BookingStatus.CONFIRMED) {
        throw new BadRequestException('Ticket is already checked in');
      }

      ticket.booking_status = BookingStatus.CONFIRMED;
      ticket.updated_at = new Date();
      return await this.ticketRepository.save(ticket);
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

  private async validateFlight(
    flightId: number,
    errorMessage: string,
  ): Promise<Flight> {
    const flight = await this.flightRepository.findOne({
      where: { id: flightId },
    });
    if (!flight) {
      throw new BadRequestException(errorMessage);
    }

    return flight;
  }

  private async validateRelationship(
    outbound_flight: Flight,
    return_flight: Flight,
  ): Promise<void> {
    // Check if outbound flight's arrival date is before return flight's departure date
    if (outbound_flight.arrival_time >= return_flight.departure_time) {
      throw new BadRequestException(
        'Outbound flight arrival time must be before return flight departure time',
      );
    }

    // Check if outbound flight's departure airport is the same as return flight's arrival airport
    if (outbound_flight.departure_airport !== return_flight.arrival_airport) {
      throw new BadRequestException(
        'Outbound flight departure airport must be the same as return flight arrival airport',
      );
    }

    // Check if outbound flight's arrival airport is the same as return flight's departure airport
    if (outbound_flight.arrival_airport !== return_flight.departure_airport) {
      throw new BadRequestException(
        'Outbound flight arrival airport must be the same as return flight departure airport',
      );
    }
  }

  private async calculateTicketPrices(
    outboundBasePrice: string,
    returnBasePrice: string = null,
    totalPassengers: number,
  ): Promise<{
    outbound_ticket_price: string;
    return_ticket_price?: string;
    total_price: string;
  }> {
    const outboundTicketPrice = (
      parseFloat(outboundBasePrice) * totalPassengers
    ).toString();
    let totalPrice = parseFloat(outboundTicketPrice).toString();
    let returnTicketPrice: string | undefined;

    if (returnBasePrice) {
      returnTicketPrice = (
        parseFloat(returnBasePrice) * totalPassengers
      ).toString();
      totalPrice = (
        parseFloat(totalPrice) + parseFloat(returnTicketPrice)
      ).toString();
    }

    return {
      outbound_ticket_price: outboundTicketPrice,
      return_ticket_price: returnTicketPrice,
      total_price: totalPrice,
    };
  }
}
