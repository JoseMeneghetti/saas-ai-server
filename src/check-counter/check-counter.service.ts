import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/auth/types/user.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckCounterService {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    const counter_param = this.config.get<string>('MAX_FREE_COUNTS');
    if (!counter_param)
      throw new ForbiddenException('No ENV counter parameter configured.');
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

  async increaseApiLimit(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);

    const isValidSubscription = await this.checkSubscription(user);

    if (isValidSubscription) {
      return;
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        count: user.count + 1,
      },
    });

    return true;
  }

  async checkApiLimit(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);

    const isValidSubscription = await this.checkSubscription(user);

    if (isValidSubscription) {
      return true;
    }

    if (user.count < Number(this.config.get<string>('MAX_FREE_COUNTS'))) {
      return true;
    }
    return false;
  }

  async checkSubscription(user: IUser): Promise<boolean> {
    const DAY_IN_MS = 86_400_000;

    const isValid =
      user.stripePriceId &&
      user.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

    return isValid;
  }
}
