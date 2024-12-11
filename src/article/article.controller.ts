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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminEndpoint } from 'src/auth/decorator/admin.decorator';
import { Article } from './entities/article.entity';
import { Public } from 'src/auth/decorator/public.decorator';

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
  @AdminEndpoint('Returns all articles')
  findAll() {
    return this.articleService.findAll();
  }

  @Public({
    summary: 'Get all published articles',
    description: 'Returns all published articles',
    status: 200
  })
  @Get('published')
  @ApiResponse({
    type: [Article],
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  findPublished() {
    return this.articleService.findPublished();
  }

  @Public({
    summary: 'Get article by id',
    description: 'Returns a single article',
    status: 200
  })
  @Get(':id')
  @ApiResponse({
    type: Article,
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
