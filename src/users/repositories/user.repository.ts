import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository {

  private logger: Logger = new Logger('UserRepository');

  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(user: IUser): Promise<User> {
    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error) {
      this.logger.error(`Failed to create user ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      this.logger.error(`Failed to find user ${error.message}`);
      throw error;
    }
  }

  async findById(id: string): Promise<Partial<User>> {
    try {
      return await this.userModel.findOne({ id });
    } catch (error) {
      this.logger.error(`Failed to find user ${error.message}`);
      throw error;
    }
  }
}
