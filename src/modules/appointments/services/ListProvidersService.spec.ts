import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const fake1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@fake.com',
      password: 'abc123',
    });

    const fake2 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@fake.com',
      password: 'abc123',
    });

    const logedUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'johnqua@fake.com',
      password: 'abc123',
    });

    const providers = await listProviders.execute({
      user_id: logedUser.id,
    });

    expect(providers).toEqual([
      fake1,
      fake2,
    ]);
  });
});
