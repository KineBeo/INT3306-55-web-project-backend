import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsPositive,
  Min,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { BookingClass } from 'src/enum/ticket/booking_class';
import { BookingStatus } from 'src/enum/ticket/booking_status';
import { TicketType } from 'src/enum/ticket/ticket_type';

export class UpdateTicketDto {
  @ApiProperty({
    description: 'Outbound flight ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  outbound_flight_id?: number;

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
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
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
    example: TicketType.ONE_WAY,
  })
  @IsOptional()
  ticket_type?: TicketType;

  @ApiProperty({
    enum: BookingClass,
    description: 'Booking class',
    example: BookingClass.ECONOMY,
  })
  @IsOptional()
  booking_class?: BookingClass;

  @ApiProperty({
    description: 'Booking seat code',
    example: 'A1',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  booking_seat_code?: string;

  @ApiProperty({
    description: 'Tax rate',
    example: '10',
  })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(3)
  tax_rate?: string;

  @ApiProperty({
    description: 'Description',
    example: 'This is a ticket',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  description?: string;

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
    description: 'Outbound ticket price',
    example: '100',
  })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  outbound_ticket_price?: string;

  @ApiProperty({
    description: 'Return ticket price',
    example: '100',
  })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  return_ticket_price?: string;

  @ApiProperty({
    description: 'Total original price',
    example: '200',
  })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  total_original_price?: string;

  @ApiProperty({
    description: 'Total tax amount',
    example: '20',
  })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  total_tax_amount?: string;

  @ApiProperty({
    description: 'Total price',
    example: '220',
  })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  total_price?: string;

  @ApiProperty({
    enum: BookingStatus,
    description: 'Booking status',
    example: BookingStatus.CONFIRMED,
  })
  @IsOptional()
  booking_status?: BookingStatus;
}
