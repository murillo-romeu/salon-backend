import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequest {
  email: string;
}
@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email } : IRequest): Promise<void> {
    this.mailProvider.sendMail(email, 'Pedido de recuperação de senha');
  }
}

export default SendForgotPasswordEmailService;
