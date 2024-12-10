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
    example: PassengerType.ADULT,
  })
  @IsEnum(PassengerType)
  @IsNotEmpty()
  passenger_type: PassengerType;

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
  @IsNumber()
  @IsNotEmpty()
  ticket_id: number;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  full_name: string;

  @ApiProperty({
    description: 'Birthday',
    example: '2021-12-31',
  })
  @Type(() => Date)
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({
    description: 'CCCD',
    example: '123456789',
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
