import { Test, TestingModule } from '@nestjs/testing';
import { CheckCounterController } from './check-counter.controller';

describe('CheckCounterController', () => {
  let controller: CheckCounterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckCounterController],
    }).compile();

    controller = module.get<CheckCounterController>(CheckCounterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
