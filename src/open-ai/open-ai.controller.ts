import { Body, Controller, Post } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { ImageOpenAiDto, TextOpenAiDto } from './dto';
import { ChatCompletionMessage } from 'openai/resources/chat';
import { Image } from 'openai/resources';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('open-ai')
export class OpenAiController {
  constructor(private openAiService: OpenAiService) {}

  @Post('/conversation')
  conversation(
    @GetCurrentUserId() userId: number,
    @Body() dto: TextOpenAiDto,
  ): Promise<ChatCompletionMessage> {
    return this.openAiService.conversation(userId, dto);
  }

  @Post('/code')
  codeGeneration(
    @GetCurrentUserId() userId: number,
    @Body() dto: TextOpenAiDto,
  ): Promise<ChatCompletionMessage> {
    return this.openAiService.codeGeneration(userId, dto);
  }

  @Post('/image')
  imageGeneration(
    @GetCurrentUserId() userId: number,
    @Body() dto: ImageOpenAiDto,
  ): Promise<Image[]> {
    return this.openAiService.imageGeneration(userId, dto);
  }
}
