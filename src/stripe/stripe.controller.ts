import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { GetStripeSignature } from 'src/common/decorators/get-stripe-signature.decorator';
import { IStripe } from './types';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getStripe(@GetCurrentUserId() userId: number): Promise<any> {
    return this.stripeService.getStripeSession(userId);
  }

  @Public()
  @Post('/weebhook')
  @HttpCode(HttpStatus.OK)
  weebHook(@GetStripeSignature() body: IStripe): Promise<any> {
    return this.stripeService.weebHook(body);
  }
}
