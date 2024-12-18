import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketPassengerDto } from './dto/create-ticket-passenger.dto';
import { UpdateTicketPassengerDto } from './dto/update-ticket-passenger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketPassenger } from './entities/ticket-passenger.entity';
import { Repository } from 'typeorm';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { PassengerType } from 'src/enum/ticket-passenger/passenger_type';

@Injectable()
export class TicketPassengerService {
  constructor(
    @InjectRepository(TicketPassenger)
    private ticketPassengerRepository: Repository<TicketPassenger>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  private calculateAge(birthday: Date): number {
    const today = new Date();
    const age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthday.getDate())
    ) {
      return age - 1;
    }
    return age;
  }

  private validatePassengerAge(passengerType: PassengerType, birthday: Date) {
    const age = this.calculateAge(birthday);

    switch (passengerType) {
      case PassengerType.ADULT:
        if (age < 12) {
          throw new BadRequestException(
            'Adult passengers must be 12 years or older',
          );
        }
        break;
      case PassengerType.CHILD:
        if (age < 2 || age >= 12) {
          throw new BadRequestException(
            'Child passengers must be between 2 and 11 years old',
          );
        }
        break;
      case PassengerType.INFANT:
        if (age >= 2) {
          throw new BadRequestException(
            'Infant passengers must be under 2 years old',
          );
        }
        break;
      default:
        throw new BadRequestException('Invalid passenger type');
    }
  }

  async create(
    createTicketPassengerDto: CreateTicketPassengerDto,
  ): Promise<TicketPassenger> {
    try {
      const { ticket_id, associated_adult_id, passenger_type, birthday } =
        createTicketPassengerDto;

      // Validate age based on passenger type
      this.validatePassengerAge(passenger_type, new Date(birthday));

      // Validate associated adult for non-adult passengers
      let associatedAdult = null;
      if (passenger_type === PassengerType.INFANT) {
        if (!associated_adult_id) {
          throw new BadRequestException(
            'Infant passengers must have an associated adult',
          );
        }
        associatedAdult = await this.ticketPassengerRepository.findOne({
          where: { id: associated_adult_id },
        });
        if (
          !associatedAdult ||
          associatedAdult.passenger_type !== PassengerType.ADULT
        ) {
          throw new BadRequestException(
            'Associated passenger must be an adult',
          );
        }
      } else {
        if (associated_adult_id) {
          throw new BadRequestException(
            'Only infant passengers can have an associated adult',
          );
        }
      }

      const ticket = await this.ticketRepository.findOne({
        where: { id: ticket_id },
      });

      if (!ticket) {
        throw new BadRequestException(`Ticket with ID ${ticket_id} not found`);
      }

      const ticketPassenger = this.ticketPassengerRepository.create({
        ...createTicketPassengerDto,
        ticket: ticket,
        associated_adult: associatedAdult,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return await this.ticketPassengerRepository.save(ticketPassenger);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<TicketPassenger[]> {
    try {
      const ticketPassengers = await this.ticketPassengerRepository.find({
        relations: ['ticket', 'associated_adult_id'],
      });

      return ticketPassengers;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number): Promise<TicketPassenger> {
    try {
      const ticketPassenger = await this.ticketPassengerRepository.findOne({
        where: { id },
        relations: ['ticket'],
      });

      if (!ticketPassenger) {
        throw new NotFoundException(`Ticket passenger with ID ${id} not found`);
      }

      return ticketPassenger;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: number,
    updateTicketPassengerDto: UpdateTicketPassengerDto,
  ): Promise<TicketPassenger> {
    try {
      const ticketPassenger = await this.ticketPassengerRepository.findOne({
        where: { id },
      });

      if (!ticketPassenger) {
        throw new NotFoundException(`Ticket passenger with ID ${id} not found`);
      }

      const updatedTicketPassenger = Object.assign(ticketPassenger, {
        ...updateTicketPassengerDto,
        updated_at: new Date(),
      });

      return await this.ticketPassengerRepository.save(updatedTicketPassenger);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const ticketPassenger = await this.ticketPassengerRepository.findOne({
        where: { id },
      });

      if (!ticketPassenger) {
        throw new NotFoundException(`Ticket passenger with ID ${id} not found`);
      }

      await this.ticketPassengerRepository.remove(ticketPassenger);

      return { message: 'Ticket passenger deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
