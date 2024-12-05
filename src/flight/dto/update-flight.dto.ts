import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Max,
  IsNumberString,
  IsDate,
  IsOptional,
} from 'class-validator';
import { FlightStatus } from 'src/enum/flight/flight_status';

export class UpdateFlightDto {
  @ApiProperty({
    description: 'Departure airport ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  departure_airport_id?: number;

  @ApiProperty({
    description: 'Arrival airport ID',
    example: 2,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  arrival_airport_id?: number;

  @ApiProperty({
    description: 'Airline ID',
    example: 3,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  airline_id?: number;

  @ApiProperty({
    description: 'Departure airport code',
    example: 'HAN',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  flight_number?: string;

  @ApiProperty({
    description: 'Base price',
    example: '1000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  base_price?: string;

  @ApiProperty({
    description: 'Departure time',
    example: '2021-12-31T23:59:59Z',
  })
  @IsDate()
  @IsOptional()
  departure_time?: Date;

  @ApiProperty({
    description: 'Arrival time',
    example: '2021-12-31T23:59:59Z',
  })
  @IsDate()
  @IsOptional()
  arrival_time?: Date;

  @ApiProperty({
    description: 'Flight duration',
    example: '1000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  duration?: string;

  @ApiProperty({
    description: 'Delay duration',
    example: '1000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  delay_duration?: string;

  @ApiProperty({
    description: 'Flight status',
    example: FlightStatus.SCHEDULED,
  })
  @IsOptional()
  status?: FlightStatus;
}
