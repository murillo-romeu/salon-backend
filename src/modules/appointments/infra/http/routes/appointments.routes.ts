import { Router } from 'express';
import ensureAuhenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuhenticated);

/* appointmentsRouter.get('/', async (request, response) => {
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
}); */

const appointmentsController = new AppointmentsController();

appointmentsRouter.post('/', appointmentsController.create);
export default appointmentsRouter;
