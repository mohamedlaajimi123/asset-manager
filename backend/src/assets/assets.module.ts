import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [AssetsController],
  providers: [AssetsService, PrismaService],
})
export class AssetsModule {}
