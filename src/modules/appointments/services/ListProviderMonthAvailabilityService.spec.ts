import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    fakeAppointmentsRepository.create({
      provider_id: 'fake_user',
      date: new Date(2021, 4, 20, 8, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'fake_user',
      date: new Date(2021, 4, 20, 10, 0, 0),
    });

    fakeAppointmentsRepository.create({
      provider_id: 'fake_user',
      date: new Date(2021, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'fake_user',
      year: 2021,
      month: 5,
    });

    expect(availability).toEqual(expect.arrayContaining([
      { day: 19, available: true },
      { day: 20, available: false },
      { day: 21, available: false },
      { day: 22, available: true },
    ]));
  });
});
