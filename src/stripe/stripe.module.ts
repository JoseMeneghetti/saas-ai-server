import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import Stripe from 'stripe';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [Stripe, UtilsModule],
  providers: [StripeService, Stripe],
  controllers: [StripeController],
})
export class StripeModule {}
