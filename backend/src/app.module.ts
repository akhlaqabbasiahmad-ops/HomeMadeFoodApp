import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './presentation/modules/auth.module';
import { OrderModule } from './presentation/modules/order.module';
import { TestModule } from './presentation/modules/test.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000, // 1 second
      limit: 10,
    }, {
      name: 'medium',
      ttl: 10000, // 10 seconds
      limit: 20,
    }, {
      name: 'long',
      ttl: 60000, // 1 minute
      limit: 100,
    }]),

    // Database
    DatabaseModule,

    // Feature modules
    AuthModule,
    TestModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}