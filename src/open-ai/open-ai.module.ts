import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiController } from './open-ai.controller';
import OpenAI from 'openai';
import { CheckCounterModule } from 'src/check-counter/check-counter.module';

@Module({
  imports: [CheckCounterModule],
  providers: [OpenAiService, OpenAI],
  controllers: [OpenAiController],
})
export class OpenAiModule {}
