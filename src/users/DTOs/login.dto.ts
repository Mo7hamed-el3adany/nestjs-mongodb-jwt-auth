import {
  IsNotEmpty,
  IsString,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    example: 'email@domain.com',
    description: 'User email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass!123',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}