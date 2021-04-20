import { container } from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import { Request, Response } from 'express';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { month, year } = request.body;
    const { provider_id } = request.params;

    const listProviderMonthAvailability = container.resolve(ListProviderMonthAvailabilityService);

    const availability = await listProviderMonthAvailability.execute({
      month,
      year,
      provider_id,
    });

    return response.json(availability);
  }
}
