import { IsNotEmpty, IsString } from 'class-validator';

export class ReplicatePromptDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
