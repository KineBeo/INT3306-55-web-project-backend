import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFlightDto {
  @ApiProperty({
    description: 'Departure airport ID',
    example: 25,
  })
  @IsNumber()
  @IsPositive()
  departure_airport_id: number;

  @ApiProperty({
    description: 'Arrival airport ID',
    example: 26,
  })
  @IsNumber()
  @IsPositive()
  arrival_airport_id: number;

  @ApiProperty({
    description: 'Airplane ID',
    example: 17,
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
    description: 'Base price',
    example: '2000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  base_price: string;

  @ApiProperty({
    description: 'Departure time',
    example: '2023-12-30T23:59:59Z',
  })
  @Type(() => Date)
  @IsDate()
  departure_time: Date;

  @ApiProperty({
    description: 'Arrival time',
    example: '2023-12-31T23:59:59Z',
  })
  @Type(() => Date)
  @IsDate()
  arrival_time: Date;

  @ApiProperty({
    description: 'Delay duration in milliseconds',
    example: '100',
  })
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  delay_duration: string;
}
