import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException, Query, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/enum/role';
import { User } from './entities/user.entity';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

   /**
   * ! Only admin should be able to access this endpoint
   * @param createUserDto 
   * @returns 
   */
   @Post()
   @UseGuards(JwtAuthGuard, AdminGuard)
   @Roles(Role.ADMIN)
   @ApiBearerAuth('JWT-auth')
   @ApiOperation({ summary: 'ADMIN: Create a user' })
   @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
   create(@Body() createUserDto: CreateUserDto) {
     return this.userService.create(createUserDto);
   }
 
   /**
    * ! Only admin should be able to access this endpoint
    * TODO: Add admin guard here
    * @returns 
    */
   @Get()
   @UseGuards(JwtAuthGuard, AdminGuard)
   @Roles(Role.ADMIN)
   @ApiBearerAuth('JWT-auth')
   @ApiOperation({ summary: 'ADMIN: Get all users' })
   @ApiResponse({ status: 200, description: 'Return all users.', type: User })
   findAll() {
     return this.userService.findAll();
   }
 
   /**
    * 
    * @param id: id of the user to be found (user only can access their own information)
    * @param req: request from the current user
    * @returns 
    */
   @UseGuards(JwtAuthGuard)
   @ApiBearerAuth('JWT-auth') 
   @Get('id/:id')
   @ApiOperation({ summary: 'Find a user by id' })
   findOne(@Param('id') id: number, @Request() req) {
     if (Number(req.user.sub) !== Number(id)) {
       throw new ForbiddenException('You can only access your own information');
     }
     return this.userService.findOne(id);
   }
 
   /**
    * 
    * @param id 
    * @param updateUserDto 
    * @param req 
    * @returns 
    */
   @UseGuards(JwtAuthGuard)
   @ApiBearerAuth('JWT-auth') 
   @Patch('id/:id')
   @ApiOperation({ summary: 'Update a user by id' })
   update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {
     if (Number(req.user.sub) !== Number(id)) {
       throw new ForbiddenException('You can only access your own information');
     }
     return this.userService.update(+id, updateUserDto);
   }
   /**
    * ! Only admin should be able to access this endpoint
    * @param id 
    * @returns 
    */
   @Delete('id/:id')
   @UseGuards(JwtAuthGuard, AdminGuard)
   @Roles(Role.ADMIN)
   @ApiBearerAuth('JWT-auth')
   @ApiOperation({ summary: 'ADMIN: Delete a user by id' })
   remove(@Param('id') id: number) {
     return this.userService.remove(+id);
   }
 
   // /**
   //  * TODO: Only admin should be able to access this endpoint
   //  * @param email 
   //  * @returns 
   //  */
   // @Get('email')
   // @UseGuards(JwtAuthGuard, AdminGuard)
   // @Roles(Role.ADMIN)
   // @ApiBearerAuth('JWT-auth')
   // @ApiOperation({ summary: 'ADMIN: Find a user by email' })
   // @ApiQuery({ name: 'email', required: true, type: String })
   // @ApiResponse({ status: 200, description: 'Return the user.', type: User })
   // @ApiResponse({ status: 404, description: 'User not found.' })
   // findByEmail(@Query('email') email: string) {
   //   return this.usersService.findByEmail(email);
   // }
 
   /**
    * TODO: Only admin should be able to access this endpoint
    * @param phone_number 
    * @returns 
    */
   @Get('phone')  
   @UseGuards(JwtAuthGuard, AdminGuard)
   @Roles(Role.ADMIN)
   @ApiBearerAuth('JWT-auth')
   @ApiOperation({ summary: 'ADMIN: Find a user by phone number' })
   @ApiQuery({ name: 'phone_number', required: true, type: String })
   @ApiResponse({ status: 200, description: 'Return the user.', type: User })
   @ApiResponse({ status: 404, description: 'User not found.' })
   findByPhone(@Query('phone_number') phone_number: string) {
     return this.userService.findByPhoneNumber(phone_number);
   }
}
