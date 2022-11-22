import { Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { ApiResponseProperty } from '@nestjs/swagger';

export class User extends Document implements IUser {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  email: string;

  password: string;
}
