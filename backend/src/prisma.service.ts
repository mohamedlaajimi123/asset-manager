import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { loadKeyVaultSecrets } from './config/keyvault.config';

const LOCAL_DATABASE_URL =
  'postgresql://myuser:mypassword@localhost:5433/asset_management_db?schema=public';

function resolveDatabaseUrl() {
  return process.env.NODE_ENV === 'development'
    ? LOCAL_DATABASE_URL
    : process.env.DATABASE_URL ?? process.env['DATABASE-URL'] ?? '';
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    void loadKeyVaultSecrets();

    const databaseUrl = resolveDatabaseUrl();

    if (!databaseUrl) {
      throw new Error('DATABASE_URL must be defined');
    }

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
