import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAirplaneDto {
  @ApiProperty({
    description: 'The name of the airplane model',
    example: 'Boeing 747',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  model_name: string;

  @ApiProperty({
    description: 'The name of the manufacturer',
    example: 'Boeing',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  manufacturer: string;

  @ApiProperty({
    description: 'The serial number of the airplane',
    example: '12345',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  serial_number: string;

  @ApiProperty({
    description: 'The registration number of the airplane',
    example: 'N12345',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  registration_number: string;

  @ApiProperty({
    description: 'The capacity of the airplane',
    example: 300,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(300)
  @Max(1000)
  capacity: number;

  @ApiProperty({
    description: 'The number of economy seats',
    required: true,
    example: 200,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(100)
  @Max(400)
  economy_seats: number;

  @ApiProperty({
    description: 'The number of business seats',
    required: true,
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(100)
  business_seats: number;

  @ApiProperty({
    description: 'The number of first class seats',
    required: true,
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(50)
  first_class_seats: number;
}
