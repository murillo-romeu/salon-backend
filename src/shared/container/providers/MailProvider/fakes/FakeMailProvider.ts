import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
  private message: ISendMailDTO[] = []

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.message.push(message);
  }
}
