import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import environmentValidation from './global/config/environmentValidation';
import databaseMongoConfig from './global/config/database-mongo.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './global/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { HashingProvider } from './global/providers/hashing.provider';
import { BcryptProvider } from './global/providers/bcrypt.provider';
import { ChatsModule } from './chats/chats.module';

export const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}.local`,
      load: [databaseMongoConfig, jwtConfig],
      validationSchema: environmentValidation,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'), // same thing as process.env.MONGODB_URI
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: ENV !== 'production',
      introspection: ENV !== 'production',
      debug: ENV === 'development',
      include: [],
    }),

    AuthModule,

    // LoggerModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const isProduction = configService.get('NODE_ENV') === 'production';

    //     return {
    //       pinoHttp: {
    //         transport: isProduction
    //           ? undefined
    //           : {
    //               target: 'pino-pretty',
    //               options: {
    //                 colorize: true,
    //                 singleLine: true,
    //               },
    //             },
    //         level: isProduction ? 'info' : 'debug',
    //       },
    //     };
    //   },
    // }),

    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: async (jwtConfiguration: ConfigType<typeof jwtConfig>) => ({
        secret: jwtConfiguration.jwtSecret,
        signOptions: {
          audience: jwtConfiguration.jwtTokenAudience,
          issuer: jwtConfiguration.jwtTokenIssuer,
          expiresIn: jwtConfiguration.jwtTokenExpiration,
        },
      }),
      inject: [jwtConfig.KEY],
    }),
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
})
export class AppModule {}

// nest g resource users
