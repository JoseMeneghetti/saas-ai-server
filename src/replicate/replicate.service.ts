import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReplicatePromptDto } from './dto';
import Replicate from 'replicate';
import { CheckCounterService } from 'src/check-counter/check-counter.service';

@Injectable()
export class ReplicateService {
  constructor(
    private config: ConfigService,
    private replicate: Replicate,
    private checkCounter: CheckCounterService,
  ) {
    const apiKey = this.config.get<string>('REPLICATE_API_KEY');
    if (!apiKey) {
      throw new NotFoundException('Replicate API Key not configured');
    }

    this.replicate = new Replicate({
      auth: apiKey,
    });
  }

  private async validateFreeTrial(userId: number): Promise<void> {
    const checkFreeTrial = await this.checkCounter.checkApiLimit(userId);

    if (!checkFreeTrial) {
      throw new ForbiddenException('Free Trial has expired.');
    }
  }

  private async increaseFreeTrial(userId: number): Promise<void> {
    await this.checkCounter.increaseApiLimit(userId);
  }

  private async generateReplicaAi(
    model: `${string}/${string}:${string}`,
    prompt: string,
  ): Promise<object> {
    const input = {
      prompt: prompt,
    };

    const response = await this.replicate.run(model, { input });

    return response;
  }

  async musicGeneration(
    userId: number,
    dto: ReplicatePromptDto,
  ): Promise<object> {
    await this.validateFreeTrial(userId);

    const model =
      'riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05';

    const response = this.generateReplicaAi(model, dto.prompt);

    await this.increaseFreeTrial(userId);

    return response;
  }

  async videoGeneration(
    userId: number,
    dto: ReplicatePromptDto,
  ): Promise<object> {
    await this.validateFreeTrial(userId);

    const model =
      'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351';

    const response = this.generateReplicaAi(model, dto.prompt);

    await this.increaseFreeTrial(userId);

    return response;
  }
}
