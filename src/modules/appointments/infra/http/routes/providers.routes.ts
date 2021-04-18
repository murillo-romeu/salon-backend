import { Router } from 'express';
import ensureAuhenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';

const providersRouter = Router();
providersRouter.use(ensureAuhenticated);

const providersController = new ProvidersController();

providersRouter.get('/', providersController.index);
export default providersRouter;
