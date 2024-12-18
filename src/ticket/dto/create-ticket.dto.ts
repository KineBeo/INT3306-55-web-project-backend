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
    example: 31,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  outbound_flight_id: number;

  @ApiProperty({
    description: 'Return flight ID',
    example: null,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  return_flight_id?: number;

  @ApiProperty({
    enum: TicketType,
    description: 'Ticket type',
    example: TicketType.ONE_WAY,
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
}
