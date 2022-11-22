import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { UserRepository } from './repositories/user.repository';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ENV } from 'src/common/enums/env.enum';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(ENV.JWT_SECRET),
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [
    JwtStrategy,
    UsersService,
    UserRepository,
    PasswordHelper
  ]
})
export class UsersModule {}
