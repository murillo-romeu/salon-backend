/* eslint-disable no-console */
import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private MailTemplateProvider: IMailTemplateProvider
  ) {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe Salon',
        address: from?.email || 'equipe@salon.app.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.MailTemplateProvider.parse(templateData),
    });

    console.log(`Message sent: ${message.messageId}`);
    console.log(`Message sent: ${nodemailer.getTestMessageUrl(message)}`);
  }
}
