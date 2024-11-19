import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    countryCode: 'US',
    password: 'hashedPassword123',
    birthDate: new Date('1990-01-01'),
  };

  const mockUserService = {
    findOne: jest
      .fn()
      .mockImplementation(
        (where: Prisma.UserWhereUniqueInput): Promise<User | null> => {
          return Promise.resolve(mockUser);
        },
      ),
    update: jest
      .fn()
      .mockImplementation(
        (params: {
          where: Prisma.UserWhereUniqueInput;
          data: Prisma.UserUpdateInput;
        }): Promise<User> => {
          return Promise.resolve({
            ...mockUser,
            ...params.data,
            email:
              typeof params.data.email === 'string'
                ? params.data.email
                : mockUser.email,
            firstName:
              typeof params.data.firstName === 'string'
                ? params.data.firstName
                : mockUser.firstName,
            lastName:
              typeof params.data.lastName === 'string'
                ? params.data.lastName
                : mockUser.lastName,
            phoneNumber:
              typeof params.data.phoneNumber === 'string'
                ? params.data.phoneNumber
                : mockUser.phoneNumber,
            countryCode:
              typeof params.data.countryCode === 'string'
                ? params.data.countryCode
                : mockUser.countryCode,
            password:
              typeof params.data.password === 'string'
                ? params.data.password
                : mockUser.password,
            birthDate:
              params.data.birthDate instanceof Date
                ? params.data.birthDate
                : mockUser.birthDate,
          });
        },
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find one user', async () => {
    const userWhereUniqueInput: Prisma.UserWhereUniqueInput = { id: 1 };
    const result = await controller.findOne('1');

    expect(userService.findOne).toHaveBeenCalledWith(userWhereUniqueInput);
    expect(result).toEqual(mockUser);
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const result = await controller.update('1', updateUserDto);

      expect(userService.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
      });
      expect(result).toEqual({
        ...mockUser,
        firstName: 'Jane',
        lastName: 'Smith',
      });
    });

    it('should handle invalid id format', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
      };

      try {
        await controller.update('invalid-id', updateUserDto);
        fail('should throw an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
