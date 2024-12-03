import { AirplaneStatus } from "src/enum/airplane/airplane_status";
import { Flight } from "src/flight/entities/flight.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Airplane {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => Flight, flight => flight.airplane)
    flight: Flight

    @Column()
    model_name: string;

    @Column()
    manufacturer: string;

    @Column()
    serial_number: string;

    @Column({
        unique: true,
    })
    registration_number: string;

    @Column()
    capacity: number;

    @Column()
    economy_seats: number;

    @Column()
    business_seats: number;

    @Column()
    first_class_seats: number;

    @Column({
        type: 'enum',
        enum: AirplaneStatus,
        default: AirplaneStatus.ACTIVE,
    })
    status: AirplaneStatus;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}
