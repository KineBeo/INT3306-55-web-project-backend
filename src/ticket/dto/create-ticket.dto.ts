import { BookingClass } from 'src/enum/ticket/booking_class';
import { BookingStatus } from 'src/enum/ticket/booking_status';
import { TicketType } from 'src/enum/ticket/ticket_type';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Outbound flight ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  outbound_flight_id: number;

  @ApiProperty({
    description: 'Return flight ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  return_flight_id?: number;

  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  user_id?: number;

  @ApiProperty({
    description: 'Booking date',
    example: '2021-12-31T23:59:59Z',
  })
  @IsOptional()
  @Type(() => Date)
  booking_date?: Date;

  @ApiProperty({
    enum: TicketType,
    description: 'Ticket type',
    example: TicketType.ROUND_TRIP,
  })
  ticket_type: TicketType;

  @ApiProperty({
    enum: BookingClass,
    description: 'Booking class',
    example: BookingClass.ECONOMY,
  })
  booking_class: BookingClass;

  @ApiProperty({
    description: 'Description',
    example: 'This is a ticket',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  description: string;

  @ApiProperty({
    description: 'Total passengers',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  total_passengers?: number;

  @ApiProperty({
    enum: BookingStatus,
    description: 'Booking status',
    example: BookingStatus.CONFIRMED,
  })
  booking_status: BookingStatus;
}
