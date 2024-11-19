import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Param, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.userService.findOne({ id });
    }
}
