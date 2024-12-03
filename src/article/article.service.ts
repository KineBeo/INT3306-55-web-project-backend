import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleStatus } from 'src/enum/article/article_status';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private userService: UserService,
  ) {}
  async create(author_id: number, createArticleDto: CreateArticleDto) {
    try {
      const author = await this.userService.findOne(author_id);
      if (!author) {
        throw new NotFoundException('Author not found');
      }

      const article = this.articleRepository.create({
        ...createArticleDto,
        status: ArticleStatus.DRAFT,
        created_at: new Date(),
        updated_at: new Date(),
        published_at: new Date(),
        user: { id: author_id },
      });

      await this.articleRepository.save(article);
      return article;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const articles = await this.articleRepository.find({
        relations: ['user'],
      });
      if (!articles) {
        throw new NotFoundException('No articles found');
      }

      return articles.map(article => {
        const { user, ...rest } = article;
        if (user) {
          const { id, fullname } = user;
          return { ...rest, user: { id, fullname } };
        }
        return rest;
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number): Promise<Article> {
    try {
      const article = await this.articleRepository.findOne({
        where: { id }, 
      });
      if (!article) {
        throw new NotFoundException('Article not found');
      }

      return article;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    try {
      const article = await this.articleRepository.findOne({ where: { id } });
      if (!article) {
        throw new NotFoundException('Article not found');
      }

      const updatedArticle = Object.assign(
        article,
        updateArticleDto,
        { updated_at: new Date() }
      );

      await this.articleRepository.save(updatedArticle);
      return updatedArticle;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<{message: string}> {
    try {
      const article = await this.articleRepository.findOne({ where: { id } });
      if (!article) {
        throw new NotFoundException('Article not found');
      }

      await this.articleRepository.remove(article);
      return { message: `Article #${id} removed successfully` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
