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

@Injectable()
export class TicketPassengerService {
  constructor(
    @InjectRepository(TicketPassenger)
    private ticketPassengerRepository: Repository<TicketPassenger>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}
  async create(
    createTicketPassengerDto: CreateTicketPassengerDto,
  ): Promise<TicketPassenger> {
    try {
      const { ticket_id, associated_adult_id } = createTicketPassengerDto;
      const ticket = await this.ticketRepository.findOne({
        where: { id: ticket_id },
      });
      if (!ticket) {
        throw new BadRequestException(`Ticket with ID ${ticket_id} not found`);
      }

      const associated_adult = await this.ticketPassengerRepository.findOne({
        where: { id: associated_adult_id },
      });

      const ticketPassenger = this.ticketPassengerRepository.create({
        ...createTicketPassengerDto,
        ticket: ticket,
        associated_adult_id: associated_adult || null,
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
