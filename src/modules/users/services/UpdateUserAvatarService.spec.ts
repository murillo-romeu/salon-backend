import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update user avatar', async () => {
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
    await expect(updateUserAvatar.execute({
      user_id: 'non-existing-user',
      avatarFileName: 'avatarFileName.jpg',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
