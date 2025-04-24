
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
// In a real app, we would import TerminusModule for health checks
// import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    // TerminusModule,
    // Import database modules for health checks
  ],
  controllers: [HealthController],
  providers: [
    // Health check services would be added here
  ]
})
export class HealthModule {}
