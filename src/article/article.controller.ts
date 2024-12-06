import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminEndpoint } from 'src/auth/decorator/admin.decorator';

@Controller('article')
@ApiTags('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @AdminEndpoint('Create an article')
  create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    console.log('User id:', req.user.sub);
    return this.articleService.create(Number(req.user.sub), createArticleDto);
  }

  @Get()
  @AdminEndpoint('Get all articles')
  findAll() {
    return this.articleService.findAll();
  }

  @Get('id/getArticle/:id')
  @AdminEndpoint('Get article by id')
  findOne(@Param('id') id: number) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  @AdminEndpoint('Update article by id')
  update(@Param('id') id: number, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @AdminEndpoint('Delete article by id')
  remove(@Param('id') id: number) {
    return this.articleService.remove(+id);
  }
}
