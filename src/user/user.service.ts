import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  /**
   * * Checked
   * @param createUserDto
   * @returns User
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { phone_number, password_hash, ...rest } = createUserDto;

    // Check for existing user with the same phone number
    const existingUser = await this.userRepository.findOne({
      where: { phone_number },
    });

    if (existingUser) {
      throw new ConflictException('Phone number is already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Create new user
    const newUser = this.userRepository.create({
      ...rest,
      phone_number,
      password_hash: hashedPassword,
    });

    // Save the user
    return this.userRepository.save(newUser);
  }

  /**
   * ! ADMIN ONLY
   * @returns Omit<User, 'password_hash'>[]
   */
  async findAll(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await this.userRepository.find();
    return users.map(
      ({
        password_hash,
        updateCreatedAt,
        updateUpdatedAt,
        ...userWithoutPassword
      }) => ({
        ...userWithoutPassword,
        updateCreatedAt,
        updateUpdatedAt,
      }),
    );
  }

  /**
   * * Checked
   * @param id
   * @returns Omit<User, 'password_hash'>
   */
  async findOne(id: number): Promise<Omit<User, 'password_hash'>> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(
          'User not found from find one user by id service',
        );
      }
      const {
        password_hash,
        updateCreatedAt,
        updateUpdatedAt,
        ...userWithoutPassword
      } = user;
      return { ...userWithoutPassword, updateCreatedAt, updateUpdatedAt };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Something went wrong from find one user by id service',
      );
    }
  }

  /**
   * ! ADMIN ONLY
   * @param id
   * @param updateUserDto
   * @returns User
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    const { password_hash, ...rest } = updateUserDto;
    if (password_hash) {
      user.password_hash = await bcrypt.hash(password_hash, 10);
    }

    Object.assign(user, rest);
    return this.userRepository.save(user);
  }

  /**
   * ! ADMIN ONLY
   * @param id
   * @returns message
   */
  async remove(id: number): Promise<{ message: string }> {
    try {
      const res = await this.userRepository.delete(id);
      if (res.affected === 0) {
        throw new ConflictException(`User with ${id} not found`);
      } else {
        const message = `User with id ${id} has been successfully deleted`;
        return { message };
      }
    } catch (error) {
      console.log(error);
      throw new ConflictException(
        `User with ${id} not found from remove user by id service`,
      );
    }
  }

  /**
   *
   * @param phone_number
   * @returns User
   */
  async findByPhoneNumberWithPassword(
    phone_number: string,
  ): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { phone_number },
      });
      if (!user) {
        throw new ConflictException(
          'User not found from find by phone number with password service',
        );
      }
      return user;
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong from find by phone number with password service',
      );
    }
  }

  /**
   * ! ADMIN ONLY
   * @param phone_number
   * @returns Omit<User, 'password_hash'>
   */
  async findByPhoneNumber(
    phone_number: string,
  ): Promise<Omit<User, 'password_hash'> | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { phone_number },
      });
      if (!user) {
        throw new ConflictException(
          'User not found from find by phone number service',
        );
      }
      const {
        password_hash,
        updateCreatedAt,
        updateUpdatedAt,
        ...userWithoutPassword
      } = user;
      return { ...userWithoutPassword, updateCreatedAt, updateUpdatedAt };
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong from find by phone number service',
      );
    }
  }
}
