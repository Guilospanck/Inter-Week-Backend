import { UserAuthenticationUsecase } from './user_authentication.usecase';
import { userKeysRepositorySpy, userKeysSpy } from '../../../mocks/user_keys/user_keys.mocks'
import { joseSpy, privateJWKeySpy, publicJWKeySpy, rawEncryptedSpy, rawToBeEncryptedSpy, jwtValidatedSpy } from '../../../mocks/jose/jose.mocks';
import { asymmetricKeysSpy } from '../../../mocks/asymmetric_keys/asymmetric_keys.mocks';
import { userSpy } from '../../../mocks/users/users.mocks';
import { right, left } from '../../../shared/utils/either';
import { JWKeys } from "../../../applications/interfaces/iasymmetric_keys";
import { NotFoundError } from '../../../applications/errors/notfound.error';
import jwt from 'jsonwebtoken';

function makeSut() {
  const sut = new UserAuthenticationUsecase(userKeysRepositorySpy, joseSpy, asymmetricKeysSpy);

  return { sut };
}

describe('UserAuthenticationUsecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('Should return a valid JWT payload', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(userKeysSpy));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'decrypt').mockResolvedValueOnce(right(rawToBeEncryptedSpy));
    jest.spyOn(jwt, 'verify').mockImplementation(() => jwtValidatedSpy);

    // act
    const result = await sut.perform(rawEncryptedSpy, userSpy.id);

    // assert
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(jwtValidatedSpy);
  });

  it('Should return left because JWT payload is no longer valid', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(userKeysSpy));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'decrypt').mockResolvedValueOnce(right(rawToBeEncryptedSpy));

    // act
    const result = await sut.perform(rawEncryptedSpy, userSpy.id);

    // assert
    expect(result.isLeft()).toBeTruthy();
  })

  it('Should return left if userKeysRepository.getUserKeysByUserId is left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(left(new Error()));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'decrypt').mockResolvedValueOnce(right(rawToBeEncryptedSpy));

    // act
    const result = await sut.perform(rawEncryptedSpy, userSpy.id);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

  it('Should return left NotFoundError if userKeysRepository.getUserKeysByUserId is right undefined', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(undefined));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'decrypt').mockResolvedValueOnce(right(rawToBeEncryptedSpy));

    // act
    const result = await sut.perform(rawEncryptedSpy, userSpy.id);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('Should return left if asymmetricKeys.getKeysAsJWKKey is left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(userKeysSpy));
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(left(new Error()));
    jest.spyOn(joseSpy, 'decrypt').mockResolvedValueOnce(right(rawToBeEncryptedSpy));

    // act
    const result = await sut.perform(rawEncryptedSpy, userSpy.id);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

  it('Should return left if jose.decrypt is left', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(userKeysSpy));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'decrypt').mockResolvedValueOnce(left(new Error()));

    // act
    const result = await sut.perform(rawEncryptedSpy, userSpy.id);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

  it('Should return left if JWT verify throws an error', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(userKeysRepositorySpy, 'getUserKeysByUserId').mockResolvedValueOnce(right(userKeysSpy));
    const JWKeysSpy: JWKeys = {
      privateJWKey: await privateJWKeySpy(),
      publicJWKey: await publicJWKeySpy(),
    };
    jest.spyOn(asymmetricKeysSpy, 'getKeysAsJWKKey').mockResolvedValueOnce(right(JWKeysSpy));
    jest.spyOn(joseSpy, 'decrypt').mockResolvedValueOnce(right(rawToBeEncryptedSpy));

    jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error() });

    // act
    const result = await sut.perform(rawEncryptedSpy, userSpy.id);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });

});