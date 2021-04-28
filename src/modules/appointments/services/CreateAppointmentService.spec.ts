import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(
      () => new Date(2020, 4, 10, 12).getTime(),
    );

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'fake_user',
      provider_id: 'fake_provider',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('fake_provider');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 15);

    jest.spyOn(Date, 'now').mockImplementation(
      () => new Date(2020, 4, 10, 10).getTime(),
    );

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'fake_user',
      provider_id: 'fake_provider',
    });

    await expect(createAppointment.execute({
      date: appointmentDate,
      user_id: 'fake_user',
      provider_id: 'fake_provider',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a pasta date', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    jest.spyOn(Date, 'now').mockImplementationOnce(
      () => new Date(2020, 4, 10, 12).getTime(),
    );

    await expect(createAppointment.execute({
      date: appointmentDate,
      user_id: 'fake_user',
      provider_id: 'fake_provider',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    const appointmentDate = new Date(2020, 4, 10, 13);

    jest.spyOn(Date, 'now').mockImplementationOnce(
      () => new Date(2020, 4, 10, 12).getTime(),
    );

    await expect(createAppointment.execute({
      date: appointmentDate,
      user_id: 'fake_same_user_provider',
      provider_id: 'fake_same_user_provider',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    const appointmentDate = new Date(2020, 4, 11, 7);

    jest.spyOn(Date, 'now').mockImplementationOnce(
      () => new Date(2020, 4, 10, 12).getTime(),
    );

    await expect(createAppointment.execute({
      date: appointmentDate,
      user_id: 'fake_user',
      provider_id: 'fake_provider',
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
      date: appointmentDate,
      user_id: 'fake_user',
      provider_id: 'fake_provider',
    })).rejects.toBeInstanceOf(AppError);
  });
});
