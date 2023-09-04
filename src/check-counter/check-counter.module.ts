import { Module } from '@nestjs/common';
import { CheckCounterController } from './check-counter.controller';
import { CheckCounterService } from './check-counter.service';

@Module({
  controllers: [CheckCounterController],
  providers: [CheckCounterService],
  exports: [CheckCounterService],
})
export class CheckCounterModule {}
