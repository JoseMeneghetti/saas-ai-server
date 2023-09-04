import { Test, TestingModule } from '@nestjs/testing';
import { CheckCounterService } from './check-counter.service';

describe('CheckCounterService', () => {
  let service: CheckCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckCounterService],
    }).compile();

    service = module.get<CheckCounterService>(CheckCounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
