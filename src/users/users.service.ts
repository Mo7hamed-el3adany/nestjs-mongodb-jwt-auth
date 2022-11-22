import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { v4 } from 'uuid';
import { CreateUserDTO } from './DTOs/create-user.dto';
import { LoginDTO } from './DTOs/login.dto';
import { User } from './models/user.model';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHelper: PasswordHelper,
    private readonly jwtService: JwtService,
  ) {}

  async create({ email, password }: CreateUserDTO): Promise<{ id: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if(existingUser) {
      throw new ConflictException(`User with email ${email} already exists.`);
    }

    const securePassword = await this.passwordHelper.secure(password);

    const createdUser = await this.userRepository.create({
      email,
      id: v4(),
      password: securePassword,
    });

    return {
      id: createdUser.id
    };
  }

  async login({ email, password }: LoginDTO): Promise<{ accessToken: string }>{
    try {
      const user = await this.userRepository.findByEmail(email);
      if(!user) {
        this.logger.error(`Failed to authenticate user with email ${email} doesn't exists.`)
        throw new UnauthorizedException(`Wrong credentials.`);
      }
      const passwordValid = await this.passwordHelper.validate(password, user.password);
      if(!passwordValid) {
        this.logger.error(`Failed to authenticate user with email ${email} provided wrong password.`)
        throw new UnauthorizedException(`Wrong credentials.`);
      }

      const accessToken = this.jwtService.sign(
        { userId: user.id },
      );
      return {
        accessToken,
      };
    } catch (error) {
      this.logger.error(`Failed to login user ${error.message}`);
      throw error;
    }
  }

  async getMe(id: string): Promise<Partial<User>>{
    try {
      const user = await this.userRepository.findById(id);
      if(!user){
        this.logger.error(`User with id ${id} doesn't exists.`)
        throw new UnauthorizedException(`Unauthorized.`);
      }
      return {
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      this.logger.error(`Failed to find user ${error.message}`);
      throw error;
    }
  }
}
