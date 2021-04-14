import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: 'abc123',
    });

    await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe Update',
      email: 'johndoe@fakeupdate.com',
    });

    expect(user.email).toBe('johndoe@fakeupdate.com');
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: 'old-password',
    });

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe Update',
      email: 'johndoe@fakeupdate.com',
      old_password: 'old-password',
      password: 'new-password',
    });

    expect(generateHash).toHaveBeenCalled();
  });

  it('should no be able to update user profile from non existing user', async () => {
    await expect(updateProfileService.execute({
      user_id: 'non-existing-user',
      name: 'John Doe Update',
      email: 'johndoe@fakeupdate.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should no be able to update user profile with e-mail already in use', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: 'abc123',
    });

    const userUpdate = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoeupdate@fake.com',
      password: 'abc123',
    });

    await expect(updateProfileService.execute({
      user_id: userUpdate.id,
      name: 'John Doe',
      email: 'johndoe@fake.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should no be able to update user profile with not inform old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: 'abc123',
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: 'new-password',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should no be able to update user profile with old password does not match', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: 'abc123',
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: 'new-password',
      old_password: 'old-password',
    })).rejects.toBeInstanceOf(AppError);
  });
});
