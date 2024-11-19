import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Prisma, User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one user', async () => {
    const userWhereUniqueInput: Prisma.UserWhereUniqueInput = { id: 1 };
    const expectedUser: User = {
      id: 1,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890', // This is now the unique identifier
      countryCode: '+1',
      password: 'hashedPassword123',
      birthDate: new Date('1990-01-01'),
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(expectedUser);

    const user = await service.findOne(userWhereUniqueInput);
    expect(user).toEqual(expectedUser);
  });
});
