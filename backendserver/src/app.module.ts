
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DoctorsModule } from './doctors/doctors.module';
import { ChatModule } from './chat/chat.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DoctorsModule,
    ChatModule,
    HealthModule,
  ],
})
export class AppModule {}
