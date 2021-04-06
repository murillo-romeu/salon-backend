import { Router } from 'express';
import multer from 'multer';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadCOnfig from '@config/upload';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UsersAvatarController from '@modules/users/infra/http/controllers/UsersAvatarController';

const usersControllers = new UsersController();
const usersAvatarController = new UsersAvatarController();

const usersRouter = Router();
const upload = multer(uploadCOnfig);

usersRouter.post('/', usersControllers.create);
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update,
);

export default usersRouter;
