import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AssetsModule } from './assets/assets.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from './config/mail.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailConfig,
    }),

    AuthModule, 
    AssetsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}