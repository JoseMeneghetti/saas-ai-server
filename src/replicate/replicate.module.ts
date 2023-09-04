import { Module } from '@nestjs/common';
import { ReplicateController } from './replicate.controller';
import { ReplicateService } from './replicate.service';
import Replicate from 'replicate';
import { CheckCounterModule } from 'src/check-counter/check-counter.module';

@Module({
  imports: [CheckCounterModule],
  controllers: [ReplicateController],
  providers: [ReplicateService, Replicate],
})
export class ReplicateModule {}
