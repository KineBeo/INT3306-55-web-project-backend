import { IsOptional } from 'class-validator';
import { PassengerType } from 'src/enum/ticket-passenger/passenger_type';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TicketPassenger {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: PassengerType,
    default: PassengerType.ADULT,
  })
  passenger_type: PassengerType;

  @IsOptional()
  @ManyToOne(() => TicketPassenger, { nullable: true })
  @JoinColumn({ name: 'associated_adult_id' })
  associated_adult_id: TicketPassenger;

  @ManyToOne(() => Ticket, (ticket) => ticket.ticketPassengers)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column()
  full_name: string;

  @Column()
  birthday: Date;

  @Column()
  cccd: string;

  @Column()
  country_code: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
