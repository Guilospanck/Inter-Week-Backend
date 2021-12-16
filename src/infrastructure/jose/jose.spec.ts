import { Jose } from './jose';
import { rawToBeEncryptedSpy, PublicKeySpy, PrivateKeySpy, publicJWKeySpy, privateJWKeySpy, rawEncryptedSpy } from '../../mocks/jose/jose.mocks';

function makeSut() {
  const sut = new Jose();

  return {
    sut
  };
}

describe("JOSE.encrypt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return right Encrypted raw value using the public key provided', async () => {
    // arrange
    const { sut } = makeSut();
    const publicJWKey = await publicJWKeySpy();

    // act
    const result = await sut.encrypt(rawToBeEncryptedSpy, publicJWKey);

    // assert
    expect(result.isRight()).toBeTruthy();
    expect(typeof(result.value)).toBe('string');
  });

  it('should return left if raw is not present', async () => {
    // arrange
    const { sut } = makeSut();
    const publicJWKey = await publicJWKeySpy();

    // act
    const result = await sut.encrypt('', publicJWKey);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);

  });

  it('should return left if some error occurs', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.encrypt(rawToBeEncryptedSpy, PublicKeySpy as any); // PublicKeySpy is not a JWK.Key, so it's going to return error

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);

  });

});

describe("JOSE.decrypt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should return right decrypted encrypted value using the private key provided', async () => {
    // arrange
    const { sut } = makeSut();
    const privateJWKey = await privateJWKeySpy();

    // act
    const result = await sut.decrypt(rawEncryptedSpy, privateJWKey);

    // assert
    expect(result.isRight()).toBeTruthy();
    expect(typeof(result.value)).toBe('string');

  });

  it('should return left if raw is not present', async () => {
    // arrange
    const { sut } = makeSut();
    const privateJWKey = await privateJWKeySpy();

    // act
    const result = await sut.decrypt('', privateJWKey);

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);

  });

  it('should return left if some error occurs', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.decrypt(rawEncryptedSpy, PrivateKeySpy as any); // PrivateKeySpy is not a JWK.Key, so it's going to return error

    // assert
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);

  });

});