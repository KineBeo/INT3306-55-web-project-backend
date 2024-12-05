import { BookingClass } from 'src/enum/ticket/booking_class';
import { BookingStatus } from 'src/enum/ticket/booking_status';
import { TicketType } from 'src/enum/ticket/ticket_type';
import { Flight } from 'src/flight/entities/flight.entity';
import { TicketPassenger } from 'src/ticket-passenger/entities/ticket-passenger.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('increment')
  id: number;
  /**
   * ! Relationship
   * TODO: userId: Int @foreignKey(User.id)
   * TODO: outboundFlightId: Int @foreignKey(Flight.id)
   * TODO: returnFlightId: Int @foreignKey(Flight.id) @nullable
   */

  @ManyToOne(() => Flight)
  @JoinColumn({ name: 'outbound_flight_id' })
  outboundFlight: Flight;

  @ManyToOne(() => Flight)
  @JoinColumn({ name: 'return_flight_id' })
  returnFlight: Flight;

  /**
   * ! checked
   */
  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * Assigned value when a user books the ticket
   */
  @Column({ nullable: true })
  booking_date: Date;

  @Column({
    type: 'enum',
    enum: TicketType,
    default: TicketType.ONE_WAY,
  })
  ticket_type: TicketType;

  @Column({
    type: 'enum',
    enum: BookingClass,
    default: BookingClass.ECONOMY,
  })
  booking_class: BookingClass;

  @Column()
  booking_seat_code: string;

  @Column()
  description: string;

  /**
   * Assigned value when a user books the ticket
   */
  @Column({ nullable: true })
  total_passengers: number;

  @Column()
  base_price: string;

  /**
   * outbound_ticket_price = base_price * total_passengers
   */
  @Column()
  outbound_ticket_price: string;

  /**
   * return_ticket_price = base_price * total_passengers
   */
  @Column()
  return_ticket_price: string;

  /**
   * total_price = outbound_ticket_price + return_ticket_price
   */
  @Column()
  total_price: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  booking_status: BookingStatus;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @OneToMany(() => TicketPassenger, (ticketPassenger) => ticketPassenger.ticket)
  ticketPassengers: TicketPassenger[];
}
