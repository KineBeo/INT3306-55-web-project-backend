import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Param, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne({ id: parseInt(id) });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
