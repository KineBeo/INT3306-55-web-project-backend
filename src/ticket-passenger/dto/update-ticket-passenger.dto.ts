import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsString,
  MinLength,
  MaxLength,
  IsDate,
  IsNumberString,
} from 'class-validator';
import { PassengerType } from 'src/enum/ticket-passenger/passenger_type';

export class UpdateTicketPassengerDto {
  @ApiProperty({
    enum: PassengerType,
    description: 'Passenger type',
    example: PassengerType.ADULT,
  })
  @IsEnum(PassengerType)
  @IsNotEmpty()
  @IsOptional()
  passenger_type?: PassengerType;
  @ApiProperty({
    description: 'Associated adult ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  associated_adult_id?: number;

  @ApiProperty({
    description: 'Ticket ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  ticket_id?: number;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  full_name?: string;

  @ApiProperty({
    description: 'Birthday',
    example: '2021-12-31T23:59:59Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsNotEmpty()
  birthday?: Date;

  @ApiProperty({
    description: 'CCCD',
    example: '123456789',
  })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  cccd?: string;

  @ApiProperty({
    description: 'Country code',
    example: 'VN',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country_code?: string;
}
