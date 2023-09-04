import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CheckCounterModule } from 'src/check-counter/check-counter.module';

@Module({
  imports: [PrismaModule, JwtModule.register({}), CheckCounterModule],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
