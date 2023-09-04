import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IStripe } from 'src/stripe/types';

export const GetStripeSignature = createParamDecorator(
  (_: undefined, context: ExecutionContext): IStripe => {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const body = request.rawBody;
    const signature = headers['stripe-signature'] ?? null;

    return {
      body: body,
      signature: signature,
    };
  },
);
