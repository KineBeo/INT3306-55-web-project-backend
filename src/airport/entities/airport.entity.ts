import { Flight } from 'src/flight/entities/flight.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Airport {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(() => Flight, (flight) => flight.departure_airport)
  departure_flights: Flight[];

  @OneToMany(() => Flight, (flight) => flight.arrival_airport)
  arrival_flights: Flight[];

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
