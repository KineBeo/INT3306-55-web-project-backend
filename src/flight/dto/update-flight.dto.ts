import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumberString,
  IsDate,
  IsOptional,
} from 'class-validator';
import { FlightStatus } from 'src/enum/flight/flight_status';

export class UpdateFlightDto {
  @ApiProperty({
    description: 'Departure airport ID',
    example: 25,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  departure_airport_id?: number;

  @ApiProperty({
    description: 'Arrival airport ID',
    example: 26,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  arrival_airport_id?: number;

  @ApiProperty({
    description: 'Airplae ID',
    example: 17,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  airplane_id?: number;

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
  @MinLength(1)
  @MaxLength(20)
  @IsOptional()
  base_price?: string;

  @ApiProperty({
    description: 'Departure time',
    example: '2021-12-30T23:59:59Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  departure_time?: Date;

  @ApiProperty({
    description: 'Arrival time',
    example: '2021-12-31T23:59:59Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  arrival_time?: Date;

  @ApiProperty({
    description: 'Delay duration in milliseconds',
    example: '1000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  @IsOptional()
  delay_duration?: string;

  @ApiProperty({
    description: 'Flight status',
    example: FlightStatus.SCHEDULED,
  })
  @IsOptional()
  status?: FlightStatus;
}
