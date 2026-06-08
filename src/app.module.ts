import { Module } from '@nestjs/common';
import { RegistryModule } from './registry.module';

@Module({
  imports: [RegistryModule],
})
export class AppModule {}
