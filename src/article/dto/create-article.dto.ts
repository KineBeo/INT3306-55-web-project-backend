import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'How to create a NestJS application',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'The description of the article',
    example: 'A step-by-step guide to create a NestJS application',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  description: string;

  @ApiProperty({
    description: 'The content of the article',
    example: 'This is the content of the article',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: 'The image URL of the article',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  image_url: string;
}
