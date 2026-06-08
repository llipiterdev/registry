import { Module } from '@nestjs/common';
import { registryProviders } from './config/registry.config';
import { RegistryController } from './delivery/rest/registry.controller';

@Module({
  controllers: [RegistryController],
  providers: [...registryProviders],
  exports: [...registryProviders],
})
export class RegistryModule {}
