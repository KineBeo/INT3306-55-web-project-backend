import { IsNotEmpty } from 'class-validator';
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
  @IsNotEmpty()
  departure_airport: Airport;

  @ManyToOne(() => Airport, (airport) => airport.arrival_flights)
  @JoinColumn({ name: 'arrival_airport_id' })
  @IsNotEmpty()
  arrival_airport: Airport;

  @ManyToOne(() => Airplane, (airplane) => airplane.flights)
  @JoinColumn({ name: 'airplane_id' })
  @IsNotEmpty()
  airplane: Airplane;

  /**
   * ! Số hiệu chuyến bay
   */
  @Column()
  @IsNotEmpty()
  flight_number: string;

  @Column()
  @IsNotEmpty()
  base_price: string;

  @Column()
  @IsNotEmpty()
  departure_time: Date;

  @Column()
  @IsNotEmpty()
  arrival_time: Date;

  @Column()
  @IsNotEmpty()
  duration: string;

  @Column()
  @IsNotEmpty()
  delay_duration: string;

  @Column({
    type: 'enum',
    enum: FlightStatus,
    default: FlightStatus.SCHEDULED,
  })
  @IsNotEmpty()
  status: FlightStatus;

  @Column()
  @IsNotEmpty()
  created_at: Date;

  @Column()
  @IsNotEmpty()
  updated_at: Date;
}
