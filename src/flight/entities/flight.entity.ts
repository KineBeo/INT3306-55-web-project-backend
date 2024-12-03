import { Airplane } from 'src/airplane/entities/airplane.entity';
import { Airport } from 'src/airport/entities/airport.entity';
import { FlightStatus } from 'src/enum/flight/flight_status';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(() => Ticket, (ticket) => ticket.outboundFlight)
  outboundTickets: Ticket[];

  @OneToMany(() => Ticket, (ticket) => ticket.returnFlight)
  returnTickets: Ticket[];
  /**
   * ! Airport relationship
   * ! departure_airport_id: Int @foreignKey(Airport.id)
   * ! arrival_airport_id: Int @foreignKey(Airport.id)
   * ! airline_id: Int @foreignKey(Airline.id)
   */

  @ManyToOne(() => Airport, (airport) => airport.departure_flights)
  @JoinColumn({ name: 'departure_airport_id' })
  departure_airport: Airport;

  @ManyToOne(() => Airport, (airport) => airport.arrival_flights)
  @JoinColumn({ name: 'arrival_airport_id' })
  arrival_airport: Airport;

  @OneToOne(() => Airplane, (airplane) => airplane.flight)
  @JoinColumn({ name: 'airplane_id' })
  airplane: Airplane;

  /**
   * ! Số hiệu chuyến bay
   */
  @Column()
  flight_number: string;

  @Column()
  available_seats: number;

  @Column()
  base_price: string;

  @Column()
  departure_time: Date;

  @Column()
  arrival_time: Date;

  @Column()
  duration: string;

  @Column()
  delay_duration: string;

  @Column({
    type: 'enum',
    enum: FlightStatus,
    default: FlightStatus.SCHEDULED,
  })
  status: FlightStatus;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
