import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, Prisma } from '@prisma/client';

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
    birthDate: new Date('1990-01-01')
  };

  const mockUserService = {
    findOne: jest.fn().mockImplementation((where: Prisma.UserWhereUniqueInput): Promise<User | null> => {
      return Promise.resolve(mockUser);
    })
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
});