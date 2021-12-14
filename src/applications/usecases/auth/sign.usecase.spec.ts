import { AuthSignUseCase } from './sign.usecase';
import { userKeysRepositorySpy } from '../../../mocks/user_keys/user_keys.mocks'

function makeSut() {
  const sut = new AuthSignUseCase(userKeysRepositorySpy);

  return { sut };
}

describe('AuthSignUsecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should sign user and return an encrypted token', async () => {
    const { sut } = makeSut();
    
  });
});