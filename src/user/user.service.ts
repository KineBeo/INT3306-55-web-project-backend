import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.userRepository.findUnique(userWhereUniqueInput);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.userRepository.findMany(params);
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.userRepository.create(data);
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return this.userRepository.update(params);
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.userRepository.delete(where);
  }
}
