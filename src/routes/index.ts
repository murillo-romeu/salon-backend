import { Router } from 'express';

const routes = Router();

routes.get('/users', (request, response) => {
  const { name, password } = request.body;

  const user = {
    name,
    password,
  };

  return response.json({ message: user });
});

export default routes;
