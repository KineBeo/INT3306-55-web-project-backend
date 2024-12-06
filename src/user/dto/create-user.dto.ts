import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../enum/role';
import { Gender } from 'src/enum/gender';
export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Nguyễn Văn A',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6, { message: 'Full name must be at least 6 characters long' })
  @MaxLength(50, { message: 'Full name must not exceed 50 characters' })
  @IsNotEmpty({ message: 'Full name is required' })
  fullname: string;

  @ApiProperty({
    description: 'Vietnam phone number',
    example: '0123456789',
    minLength: 10,
    maxLength: 10,
  })
  @IsNumberString({}, { message: 'Phone number must contain only digits' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits long' })
  @IsPhoneNumber('VN', { message: 'Must be a valid Vietnam phone number' })
  phone_number: string;

  @ApiProperty({
    description: 'Email address',
    example: 'example@gmail.com',
  })
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password with specific requirements',
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(200, { message: 'Password must not exceed 200 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password_hash: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    default: Role.USER,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({
    description: "User's date of birth",
    example: '1990-01-01',
    type: String,
    format: 'date',
  })
  @IsNotEmpty({ message: 'Date of birth is required' })
  birthday: Date;

  @ApiProperty({
    description: 'Gender of the user',
    enum: Gender,
  })
  @IsEnum(Gender, { message: 'Invalid gender' })
  @IsNotEmpty({ message: 'Gender is required' })
  gender: Gender;
}
