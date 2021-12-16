import { UserSigninUseCase } from './user_signin.usecase';
import { userKeysRepositorySpy, userKeysSpy } from '../../../mocks/user_keys/user_keys.mocks'
import { joseSpy, privateJWKeySpy, PrivateKeySpy, publicJWKeySpy, PublicKeySpy, rawEncryptedSpy } from '../../../mocks/jose/jose.mocks';
import { asymmetricKeysSpy, keysSpy } from '../../../mocks/asymmetric_keys/asymmetric_keys.mocks';
import { userSpy, usersRepositorySpy } from '../../../mocks/users/users.mocks';
import { right, left } from '../../../shared/utils/either';
import { JWKeys } from "../../../applications/interfaces/iasymmetric_keys";
import { authSignUseCaseSpy } from '../../../mocks/auth_sign_usecase/auth_sign_usecase.mocks';
import { NotFoundError } from '../../errors/notfound.error';

function makeSut() {
  const sut = new UserSigninUseCase(usersRepositorySpy, authSignUseCaseSpy);

  return { sut };
}

describe('UserSigninUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('Should signin user and return its encrypted token and data (without password)', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(usersRepositorySpy, 'getUserByEmailAndPassword').mockResolvedValueOnce(right(userSpy));
    jest.spyOn(authSignUseCaseSpy, 'sign').mockResolvedValueOnce(right(rawEncryptedSpy));

    // act
    const result = await sut.signin(userSpy);
    let userSpyWithoutPassword = {...userSpy};
    // @ts-expect-error
    delete userSpyWithoutPassword.password;

    // assert
    expect(result.isRight()).toBeTruthy();
    expect(typeof (result.value)).toBe('object');
    expect(result.value).toEqual({
      accessToken: rawEncryptedSpy,
      user: userSpyWithoutPassword
    });
  });

  it('Should return left Error if usersRepository.getUserByEmailAndPassword returns left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(usersRepositorySpy, 'getUserByEmailAndPassword').mockResolvedValueOnce(left(new Error()));
    jest.spyOn(authSignUseCaseSpy, 'sign').mockResolvedValueOnce(right(rawEncryptedSpy));

    // act
    const result = await sut.signin(userSpy);
    let userSpyWithoutPassword = {...userSpy};
    // @ts-expect-error
    delete userSpyWithoutPassword.password;

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

  it('Should return left NotFoundError if usersRepository.getUserByEmailAndPassword returns right undefined', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(usersRepositorySpy, 'getUserByEmailAndPassword').mockResolvedValueOnce(right(undefined));
    jest.spyOn(authSignUseCaseSpy, 'sign').mockResolvedValueOnce(right(rawEncryptedSpy));

    // act
    const result = await sut.signin(userSpy);
    let userSpyWithoutPassword = {...userSpy};
    // @ts-expect-error
    delete userSpyWithoutPassword.password;

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('Should return left Error if authSignUseCaseSpy.sign returns left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(usersRepositorySpy, 'getUserByEmailAndPassword').mockResolvedValueOnce(right(userSpy));
    jest.spyOn(authSignUseCaseSpy, 'sign').mockResolvedValueOnce(left(new Error()));

    // act
    const result = await sut.signin(userSpy);
    let userSpyWithoutPassword = {...userSpy};
    // @ts-expect-error
    delete userSpyWithoutPassword.password;

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

});