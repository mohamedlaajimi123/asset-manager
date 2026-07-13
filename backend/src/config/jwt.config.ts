import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { loadKeyVaultSecrets } from "./keyvault.config";

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
    async createJwtOptions(): Promise<JwtModuleOptions> {
        const secrets = await loadKeyVaultSecrets();
        const jwtSecret = secrets.JWT_SECRET ?? process.env.JWT_SECRET ?? '';

        if (!jwtSecret) {
            throw new Error('JWT_SECRET must be defined');
        }

        return {
            secret: jwtSecret,
            signOptions: { expiresIn: '1d' },
        };
    }
}