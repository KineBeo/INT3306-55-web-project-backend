import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsPositive,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { AirplaneStatus } from 'src/enum/airplane/airplane_status';

export class UpdateAirplaneDto {
  @ApiProperty({
    description: 'The name of the airplane model',
    type: String,
    required: false,
    default: 'Boeing 747',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  model_name?: string;

  @ApiProperty({
    description: 'The name of the manufacturer',
    type: String,
    required: false,
    default: 'Boeing',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({
    description: 'The serial number of the airplane',
    type: String,
    required: false,
    default: '123456',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  serial_number?: string;

  @ApiProperty({
    description: 'The registration number of the airplane',
    type: String,
    required: false,
    default: 'N12345',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  registration_number?: string;

  @ApiProperty({
    description: 'The capacity of the airplane',
    type: Number,
    required: false,
    default: 300,
  })
  @IsPositive()
  @Min(300)
  @Max(1000)
  @IsOptional()
  capacity?: number;

  @ApiProperty({
    description: 'The number of economy seats',
    type: Number,
    required: false,
    default: 200,
  })
  @IsPositive()
  @Min(100)
  @Max(400)
  @IsOptional()
  economy_seats?: number;

  @ApiProperty({
    description: 'The number of business seats',
    type: Number,
    required: false,
    default: 50,
  })
  @IsPositive()
  @Max(100)
  @IsOptional()
  business_seats?: number;

  @ApiProperty({
    description: 'The number of first class seats',
    type: Number,
    required: false,
    default: 50,
  })
  @IsPositive()
  @Max(50)
  @IsOptional()
  first_class_seats?: number;

  @ApiProperty({
    description: 'The status of the airplane',
    example: 'ACTIVE',
  })
  @IsOptional()
  status?: AirplaneStatus;
}
