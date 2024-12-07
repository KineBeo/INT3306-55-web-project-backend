import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class BookTicketDto {
  @ApiProperty({
    description: 'Seat code for the booking',
    example: 'A12-B15',
  })
  @IsString()
  @MinLength(2)
  booking_seat_code: string;

  @ApiProperty({
    description: 'Number of passengers',
    example: 2,
  })
  @IsNumber()
  total_passengers: number;
}
