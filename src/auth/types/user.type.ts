export type IUser = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  hash: string;
  hashedRt: string;
  count: number;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
};

export type IMeResponse = {
  id: number;
  email: string;
  count: number;
  isValidSubscription: boolean;
};
