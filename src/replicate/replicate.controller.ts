import { Body, Controller, Post } from '@nestjs/common';
import { ReplicateService } from './replicate.service';
import { ReplicatePromptDto } from './dto';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('replicate')
export class ReplicateController {
  constructor(private replicateService: ReplicateService) {}

  @Post('/music')
  musicGeneration(
    @GetCurrentUserId() userId: number,
    @Body() dto: ReplicatePromptDto,
  ): Promise<object> {
    return this.replicateService.musicGeneration(userId, dto);
  }

  @Post('/video')
  videoGeneration(
    @GetCurrentUserId() userId: number,
    @Body() dto: ReplicatePromptDto,
  ): Promise<object> {
    return this.replicateService.videoGeneration(userId, dto);
  }
}
