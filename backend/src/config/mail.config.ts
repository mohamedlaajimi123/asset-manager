import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { loadKeyVaultSecrets } from './keyvault.config';

@Injectable()
export class MailConfig implements MailerOptionsFactory {
    async createMailerOptions(): Promise<MailerOptions> {
        const secrets = await loadKeyVaultSecrets();

        const fromAddress = secrets.EMAIL_FROM_ADDRESS ?? process.env.EMAIL_FROM_ADDRESS ?? 'no-reply@localhost';
        const azureEmailConnectionString =
            secrets.AZURE_EMAIL_CONNECTION_STRING ?? process.env.AZURE_EMAIL_CONNECTION_STRING ?? '';

        if (!azureEmailConnectionString) {
            console.warn('AZURE_EMAIL_CONNECTION_STRING is missing. MailerModule will use a mock stream transport.');
        }

        return {
            transport: {
                streamTransport: true,
                buffer: true,
                newline: 'unix',
            },
            defaults: {
                from: fromAddress,
            },
        };
    }
}