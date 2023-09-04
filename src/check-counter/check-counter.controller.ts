import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CheckCounterService } from './check-counter.service';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('counter')
export class CheckCounterController {
  constructor(private checkCounterService: CheckCounterService) {}

  @Get('increase')
  @HttpCode(HttpStatus.OK)
  increaseApiLimit(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.checkCounterService.increaseApiLimit(userId);
  }

  @Get('check')
  @HttpCode(HttpStatus.OK)
  checkApiLimit(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.checkCounterService.checkApiLimit(userId);
  }
}
