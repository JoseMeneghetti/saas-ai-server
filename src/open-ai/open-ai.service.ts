import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Image } from 'openai/resources';
import OpenAI from 'openai';
import { CheckCounterService } from 'src/check-counter/check-counter.service';
import { ImageOpenAiDto, TextOpenAiDto } from './dto';
import {
  ChatCompletionMessage,
  CreateChatCompletionRequestMessage,
} from 'openai/resources/chat';

@Injectable()
export class OpenAiService {
  constructor(
    private config: ConfigService,
    private openai: OpenAI,
    private checkCounter: CheckCounterService,
  ) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) throw new NotFoundException('OpenAI API Key not configured');

    this.openai = new OpenAI({ apiKey });
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

  private async generateChatCompletion(
    messages: CreateChatCompletionRequestMessage[],
  ): Promise<ChatCompletionMessage> {
    const response = await this.openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo',
    });

    return response.choices[0].message;
  }

  private async generateImages(dto: ImageOpenAiDto): Promise<Image[]> {
    const response = await this.openai.images.generate({
      prompt: dto.prompt,
      n: parseInt(dto.amount, 10),
      size: dto.resolution,
    });

    return response.data;
  }

  async conversation(
    userId: number,
    dto: TextOpenAiDto,
  ): Promise<ChatCompletionMessage> {
    await this.validateFreeTrial(userId);

    const response = this.generateChatCompletion(dto.messages);

    await this.increaseFreeTrial(userId);

    return response;
  }

  async codeGeneration(
    userId: number,
    dto: TextOpenAiDto,
  ): Promise<ChatCompletionMessage> {
    await this.validateFreeTrial(userId);

    const instructionMessage: CreateChatCompletionRequestMessage = {
      role: 'system',
      content:
        'You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.',
    };

    const messages = [instructionMessage, ...dto.messages];

    const response = this.generateChatCompletion(messages);

    await this.increaseFreeTrial(userId);

    return response;
  }

  async imageGeneration(userId: number, dto: ImageOpenAiDto): Promise<Image[]> {
    await this.validateFreeTrial(userId);

    const response = this.generateImages(dto);

    await this.increaseFreeTrial(userId);

    return response;
  }
}
