import { Request, Response } from 'express';
import UpdateAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { container } from 'tsyringe';

export default class UsersControllers {
  public async create(request: Request, response:Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    delete user.password;
    return response.json(user);
  }
}
