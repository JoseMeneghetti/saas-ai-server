import { Type } from 'class-transformer';
import { IsNotEmpty, IsArray, IsString, IsNumberString } from 'class-validator';
import { CreateChatCompletionRequestMessage } from 'openai/resources/chat';

export class OpenAiMessage {
  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  content: string;
}

export class TextOpenAiDto {
  @IsNotEmpty()
  @IsArray()
  @Type(() => OpenAiMessage)
  messages: CreateChatCompletionRequestMessage[];
}

export class ImageOpenAiDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;
  @IsNumberString()
  amount: '1' | '2' | '3' | '4';
  @IsString()
  resolution: '512x512' | '1024x1024' | '256x256';
}
