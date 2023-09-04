import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';
import { OpenAiModule } from './open-ai/open-ai.module';
import { ReplicateModule } from './replicate/replicate.module';
import { CheckCounterModule } from './check-counter/check-counter.module';
import { StripeModule } from './stripe/stripe.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    OpenAiModule,
    ReplicateModule,
    CheckCounterModule,
    StripeModule,
    UtilsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
