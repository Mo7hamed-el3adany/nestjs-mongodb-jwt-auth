import { Body, Controller, Get, Logger, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUserId } from 'src/common/decorators/get-user-id.decorator';
import { CreateUserDTO } from './DTOs/create-user.dto';
import { LoginDTO } from './DTOs/login.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create user.' })
  @ApiCreatedResponse({description: 'User has been successfully registered.'})
  @ApiConflictResponse({description: 'User with provided email already exists.'})
  async create(@Body(ValidationPipe) createUserDTO: CreateUserDTO): Promise<{ id: string }> {
   return await this.usersService.create(createUserDTO);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user.' })
  @ApiOkResponse({ description: 'User authenticated.'})
  @ApiUnauthorizedResponse({ description: 'Wrong credentials'})
  async login(@Body(ValidationPipe) loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    return await this.usersService.login(loginDTO);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User id and email.', type: User })
  @ApiUnauthorizedResponse({ description: 'Unauthorized'})
  async get(@GetUserId() userId: string): Promise<Partial<User>> {
    return await this.usersService.getMe(userId);
  }
}
