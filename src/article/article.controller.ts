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

  @Get('published')
  @ApiOperation({ summary: 'Get all published articles' })
  @ApiResponse({
    status: 200,
    description: 'Returns all published articles',
    type: [Article],
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  findPublished() {
    return this.articleService.findPublished();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns a single article',
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
