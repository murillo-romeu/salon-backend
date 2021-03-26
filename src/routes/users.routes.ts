import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import UpdateAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadCOnfig from '../config/upload';

const usersRouter = Router();
const upload = multer(uploadCOnfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({ name, email, password });

    delete user.password;

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateUserAvatar = new UpdateAvatarService();

      const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFileName: request.file.filename,
      });

      delete user.password;
      return response.json(user);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  },
);

export default usersRouter;
