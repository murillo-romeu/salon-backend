import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import { Request, Response } from 'express';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      month, year, day,
    } = request.body;
    const { provider_id } = request.params;

    const listProviderDayAvailability = container.resolve(ListProviderDayAvailabilityService);

    const availability = await listProviderDayAvailability.execute({
      day,
      month,
      year,
      provider_id,
    });

    return response.json(availability);
  }
}
