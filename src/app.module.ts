import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { number, object, string } from '@hapi/joi';
import { ENV } from './common/enums/env.enum';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationSchema: object({
        NODE_ENV: string()
          .valid('development', 'production', 'test')
          .default('development'),
        HOST: string().required(),
        PORT: number().required(),
        LOG_LEVEL: string().required(),
        MONGO_DB_HOST: string().required(),
        MONGO_DB_PORT: number().required(),
        MONGO_DB_USER: string().required(),
        MONGO_DB_PASSWORD: string().required(),
        MONGO_DB_DATABASE: string().required(),
        MONGO_DB_URL: string().required(),
        PASSWORD_SECRET: string().required(),
        JWT_SECRET: string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          uri: config.get(ENV.MONGO_DB_URL),
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class AppModule {}
