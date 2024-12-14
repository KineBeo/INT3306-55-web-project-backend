import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorator/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public({
    summary: 'Get Hello',
    description: 'Returns a greeting message',
    status: 200,
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
