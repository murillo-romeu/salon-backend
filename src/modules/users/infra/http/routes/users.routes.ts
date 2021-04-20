import { Router } from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadCOnfig from '@config/upload';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UsersAvatarController from '@modules/users/infra/http/controllers/UsersAvatarController';

const usersControllers = new UsersController();
const usersAvatarController = new UsersAvatarController();

const usersRouter = Router();
const upload = multer(uploadCOnfig);

usersRouter.post('/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersControllers.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update,
);

export default usersRouter;
