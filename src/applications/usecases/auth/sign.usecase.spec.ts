import { AuthSignUseCase } from './sign.usecase';
import { userKeysRepositorySpy, userKeysSpy } from '../../../mocks/user_keys/user_keys.mocks'
import { joseSpy, privateJWKeySpy, publicJWKeySpy, rawEncryptedSpy } from '../../../mocks/jose/jose.mocks';
import { asymmetricKeysSpy, keysSpy } from '../../../mocks/asymmetric_keys/asymmetric_keys.mocks';
import { userSpy } from '../../../mocks/users/users.mocks';
import { right, left } from '../../../shared/utils/either';
import { JWKeys } from "../../../applications/interfaces/iasymmetric_keys";

function makeSut() {
  const sut = new AuthSignUseCase(userKeysRepositorySpy, joseSpy, asymmetricKeysSpy);

  return { sut };
}

describe('AuthSignUsecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('Should signup, create user and return its encrypted token', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(asymmetricKeysSpy, 'generateKeys').mockReturnValueOnce(right(keysSpy));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'encrypt').mockResolvedValueOnce(right(rawEncryptedSpy));
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(undefined));
    jest.spyOn(userKeysRepositorySpy, 'createUserKeys').mockResolvedValueOnce(right(userKeysSpy));

    // act
    const result = await sut.sign(userSpy);

    // assert
    expect(result.isRight()).toBeTruthy();
    expect(typeof (result.value)).toBe('string');
    expect(result.value).toEqual(rawEncryptedSpy);
  });

  it('Should signin, update user and return its encrypted token', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(asymmetricKeysSpy, 'generateKeys').mockReturnValueOnce(right(keysSpy));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'encrypt').mockResolvedValueOnce(right(rawEncryptedSpy));
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(userKeysSpy));
    jest.spyOn(userKeysRepositorySpy, 'updateUserKeys').mockResolvedValueOnce(right(userKeysSpy));

    // act
    const result = await sut.sign(userSpy);

    // assert
    expect(result.isRight()).toBeTruthy();
    expect(typeof (result.value)).toBe('string');
    expect(result.value).toEqual(rawEncryptedSpy);
  });

  it('Should return left if asymmetricKeys.generateKeys returns left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(asymmetricKeysSpy, 'generateKeys').mockReturnValueOnce(left(new Error()));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'encrypt').mockResolvedValueOnce(right(rawEncryptedSpy));
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(userKeysSpy));
    jest.spyOn(userKeysRepositorySpy, 'updateUserKeys').mockResolvedValueOnce(right(userKeysSpy));

    // act
    const result = await sut.sign(userSpy);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

  it('Should return left if asymmetricKeys.getKeysAsJWKKey returns left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(asymmetricKeysSpy, 'generateKeys').mockReturnValueOnce(right(keysSpy));
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(left(new Error()));
    jest.spyOn(joseSpy, 'encrypt').mockResolvedValueOnce(right(rawEncryptedSpy));
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(userKeysSpy));
    jest.spyOn(userKeysRepositorySpy, 'updateUserKeys').mockResolvedValueOnce(right(userKeysSpy));

    // act
    const result = await sut.sign(userSpy);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

  it('Should return left if JOSE.encrypt returns left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(asymmetricKeysSpy, 'generateKeys').mockReturnValueOnce(right(keysSpy));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'encrypt').mockResolvedValueOnce(left(new Error()));
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(userKeysSpy));
    jest.spyOn(userKeysRepositorySpy, 'updateUserKeys').mockResolvedValueOnce(right(userKeysSpy));

    // act
    const result = await sut.sign(userSpy);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

  it('Should return left if userKeysRepositorySpy.getUserKeysByUserId returns left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(asymmetricKeysSpy, 'generateKeys').mockReturnValueOnce(right(keysSpy));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'encrypt').mockResolvedValueOnce(right(rawEncryptedSpy));
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(left(new Error()));
    jest.spyOn(userKeysRepositorySpy, 'updateUserKeys').mockResolvedValueOnce(right(userKeysSpy));

    // act
    const result = await sut.sign(userSpy);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

  it('Should return left if userKeysRepositorySpy.updateUserKeys returns left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(asymmetricKeysSpy, 'generateKeys').mockReturnValueOnce(right(keysSpy));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'encrypt').mockResolvedValueOnce(right(rawEncryptedSpy));
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(userKeysSpy));
    jest.spyOn(userKeysRepositorySpy, 'updateUserKeys').mockResolvedValueOnce(left(new Error()));

    // act
    const result = await sut.sign(userSpy);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

  it('Should return left if userKeysRepositorySpy.createUserKeys returns left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(asymmetricKeysSpy, 'generateKeys').mockReturnValueOnce(right(keysSpy));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'encrypt').mockResolvedValueOnce(right(rawEncryptedSpy));
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(undefined));
    jest.spyOn(userKeysRepositorySpy, 'updateUserKeys').mockResolvedValueOnce(right(userKeysSpy));
    jest.spyOn(userKeysRepositorySpy, 'createUserKeys').mockResolvedValueOnce(left(new Error()));

    // act
    const result = await sut.sign(userSpy);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });
});