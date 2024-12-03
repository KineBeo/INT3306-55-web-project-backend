import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateAirportDto {
  @ApiProperty({
    description: 'The code of the airport',
    example: 'JFK',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(3)
  code?: string;

  @ApiProperty({
    description: 'The name of the airport',
    example: 'John F. Kennedy International Airport',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'The city where the airport is located',
    example: 'New York',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  city?: string;

  @ApiProperty({
    description: 'The country where the airport is located',
    example: 'United States',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  country?: string;
}
