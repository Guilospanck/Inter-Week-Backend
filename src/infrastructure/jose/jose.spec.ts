import { JWE, JWK } from 'node-jose';
import { Jose } from './jose';
import { rawToBeEncryptedSpy, PublicKeySpy, PrivateKeySpy, publicJWKeySpy } from '../../mocks/jose/jose.mocks';

function makeSut() {
  const sut = new Jose();

  return {
    sut
  };
}

describe("JOSE", () => {
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


});