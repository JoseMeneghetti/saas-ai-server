import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/auth/types/user.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';
import Stripe from 'stripe';
import { StripeDto } from './dto';
import { IStripe } from './types';

@Injectable()
export class StripeService {
  constructor(
    private config: ConfigService,
    private stripe: Stripe,
    private utils: UtilsService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.config.get<string>('STRIPE_KEY');
    if (!apiKey) throw new NotFoundException('Stripe API Key not configured');

    this.stripe = new Stripe(this.config.get<string>('STRIPE_KEY'), {
      apiVersion: '2023-08-16',
      typescript: true,
    });
  }

  private async getUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hash) throw new ForbiddenException('Access denied');

    return user;
  }

  private async createBillingPortalSession(
    stripeCustomerId: string,
  ): Promise<string> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: this.utils.absoluteUrl('/settings'),
    });

    return session.url;
  }

  private async createCheckoutSession(user: IUser): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      // customer: user.stripeCustomerId,
      success_url: this.utils.absoluteUrl('/settings'),
      cancel_url: this.utils.absoluteUrl('/settings'),
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'BRL',
            product_data: {
              name: 'Genius Pro',
              description: 'Unlimited AI Generation',
            },
            unit_amount: 1000,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    });

    return session.url;
  }

  async getStripeSession(userId: number): Promise<any> {
    const user = await this.getUser(userId);

    if (user && user.stripeCustomerId) {
      const stripeSessionUrl = await this.createBillingPortalSession(
        user.stripeCustomerId,
      );

      return { url: stripeSessionUrl };
    }

    const stripeSessionUrl = await this.createCheckoutSession(user);

    return { url: stripeSessionUrl };
  }

  private async weebHookCreateEvent(signature: string, body: any) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.config.get<string>('STRIPE_WEEBHOOK_SECRET'),
      );
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`Web Hook Error: ${error}`);
    }

    return event;
  }

  private async weebHookCreateSubscription(subscription: string) {
    const response = await this.stripe.subscriptions.retrieve(
      subscription as string,
    );

    return response;
  }

  async weebHook(body: IStripe): Promise<any> {
    if (!body?.signature && !body?.body) {
      throw new BadRequestException(`Signature or body invalid.`);
    }

    const event = await this.weebHookCreateEvent(body.signature, body.body);

    const session = event.data.object as Stripe.Checkout.Session;

    if (event?.type === 'checkout.session.completed') {
      const subscription = await this.weebHookCreateSubscription(
        session.subscription as string,
      );

      if (!session?.metadata?.userId) {
        throw new BadRequestException('User id is required');
      }

      await this.prisma.user.update({
        where: {
          id: parseInt(session.metadata.userId),
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });
    }

    if (event?.type === 'invoice.payment_succeeded') {
      const subscription = await this.weebHookCreateSubscription(
        session.subscription as string,
      );

      await this.prisma.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });
    }

    return null;
  }
}
