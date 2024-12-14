import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class BookTicketDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  user_id: number;

  @ApiProperty({
    description: 'Number of passengers',
    example: 2,
  })
  @IsNumber()
  total_passengers: number;
}
