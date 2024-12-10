import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
  IsNumberString,
} from 'class-validator';
import { PassengerType } from 'src/enum/ticket-passenger/passenger_type';

export class CreateTicketPassengerDto {
  @ApiProperty({
    enum: PassengerType,
    description: 'Passenger type',
    example: PassengerType.INFANT,
  })
  @IsEnum(PassengerType)
  @IsNotEmpty()
  passenger_type: PassengerType;

  @ApiProperty({
    description: 'Associated adult ID',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  associated_adult_id?: number;

  @ApiProperty({
    description: 'Ticket ID',
    example: 9,
  })
  @IsNumber()
  @IsNotEmpty()
  ticket_id: number;

  @ApiProperty({
    description: 'Full name',
    example: 'John Wicked',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  full_name: string;

  @ApiProperty({
    description: 'Birthday',
    example: '2023-01-31',
  })
  @Type(() => Date)
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({
    description: 'CCCD',
    example: '123456101',
  })
  @IsNumberString()
  @IsNotEmpty()
  cccd: string;

  @ApiProperty({
    description: 'Country code',
    example: 'VN',
  })
  @IsString()
  @IsNotEmpty()
  country_code: string;
}
