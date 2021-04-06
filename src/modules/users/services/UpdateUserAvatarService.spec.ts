import FakeUsersRepository from '@modules/users/repositories/fakes/UsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: 'abc123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatarFileName.jpg',
    });

    expect(user.avatar).toBe('avatarFileName.jpg');
  });

  it('should no be able to update avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(updateUserAvatar.execute({
      user_id: 'non-existing-user',
      avatarFileName: 'avatarFileName.jpg',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: 'abc123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatarFileName.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatarFileName2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatarFileName.jpg');
    expect(user.avatar).toBe('avatarFileName2.jpg');
  });
});
