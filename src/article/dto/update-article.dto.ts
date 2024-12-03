import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ArticleStatus } from 'src/enum/article/article_status';

export class UpdateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'How to create a NestJS application',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  @Optional()
  title: string;

  @ApiProperty({
    description: 'The description of the article',
    example: 'A step-by-step guide to create a NestJS application',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  @Optional()
  description: string;

  @ApiProperty({
    description: 'The content of the article',
    example: 'This is the content of the article',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(1000)
  @Optional()
  content: string;

  @ApiProperty({
    description: 'The image URL of the article',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @Optional()
  image_url: string;

  @ApiProperty({
    description: 'The status of the article',
    example: 'PUBLISHED',
  })
  @IsString()
  @IsNotEmpty()
  @Optional()
  status?: ArticleStatus;
}
