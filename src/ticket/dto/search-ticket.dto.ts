import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TicketType } from 'src/enum/ticket/ticket_type';

export class SearchTicketDto {
  @ApiProperty({
    enum: TicketType,
    example: TicketType.ROUND_TRIP,
    description: 'Type of the ticket',
  })
  @IsEnum(TicketType)
  @IsNotEmpty()
  ticket_type: TicketType;

  @ApiProperty({
    example: 'JFK',
    description: 'Code of the departure airport',
  })
  @IsString()
  @IsNotEmpty()
  departure_airport_code: string;

  @ApiProperty({
    example: 'LAX',
    description: 'Code of the arrival airport',
  })
  @IsString()
  @IsNotEmpty()
  arrival_airport_code: string;

  @ApiProperty({
    example: '2023-12-01',
    description: 'Departure date of the flight (YYYY-MM-DD)',
  })
  @IsString()
  @IsNotEmpty()
  outbound_day: string;

  @ApiPropertyOptional({
    example: '2023-12-03',
    description: 'Return date of the flight (YYYY-MM-DD)',
  })
  @IsString()
  @IsOptional()
  return_day?: string;
}
