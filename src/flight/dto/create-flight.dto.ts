import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFlightDto {
  @ApiProperty({
    description: 'Departure airport ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  departure_airport_id: number;

  @ApiProperty({
    description: 'Arrival airport ID',
    example: 2,
  })
  @IsNumber()
  @IsPositive()
  arrival_airport_id: number;

  @ApiProperty({
    description: 'Airplane ID',
    example: 3,
  })
  @IsNumber()
  @IsPositive()
  airplane_id: number;

  @ApiProperty({
    description: 'Departure airport code',
    example: 'HAN',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  flight_number: string;

  @ApiProperty({
    description: 'Number of available seats',
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  @Max(1000)
  available_seats: number;

  @ApiProperty({
    description: 'Base price',
    example: '1000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  base_price: string;

  @ApiProperty({
    description: 'Departure time',
    example: '2021-12-31T23:59:59Z',
  })
  @Type(() => Date)
  departure_time: Date;

  @ApiProperty({
    description: 'Arrival time',
    example: '2021-12-31T23:59:59Z',
  })
  @Type(() => Date)
  arrival_time: Date;

  @ApiProperty({
    description: 'Flight duration',
    example: '1000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  duration: string;

  @ApiProperty({
    description: 'Delay duration',
    example: '1000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  delay_duration: string;
}
