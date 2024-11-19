import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { UserRepository } from './user.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user = await this.userRepository.findOne(userWhereUniqueInput);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    try {
      return await this.userRepository.findAll(params);
    } catch (error) {
      throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  async create(createUserDto: CreateUserDto): Promise<User> {
      try {
        const userData: Prisma.UserCreateInput = {
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          phoneNumber: createUserDto.phoneNumber,
          countryCode: createUserDto.countryCode,
          password: createUserDto.password,
          birthDate: new Date(createUserDto.birthDate),
        };
        return await this.userRepository.create(userData);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // P2002 is Prisma's error code for unique constraint violation
          const uniqueConstraintViolation = error.code === 'P2002';
          if (uniqueConstraintViolation) {
            const target = (error.meta?.target as string[]) || [];
            
            if (target.includes('email')) {
              throw new HttpException(
                'Email already exists',
                HttpStatus.CONFLICT
              );
            }
          }
        }
        
        // Generic error if not caught above
        throw new HttpException(
          'Failed to create user',
          HttpStatus.BAD_REQUEST
        );
      }
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    try {
      const user = await this.userRepository.update(params);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    try {
      const user = await this.userRepository.delete(where);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
