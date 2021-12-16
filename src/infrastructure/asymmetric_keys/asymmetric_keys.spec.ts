import { AsymmetricKeys } from './asymmetric_keys';
const crypto = require('crypto');

import { rawToBeEncryptedSpy, PublicKeySpy, PrivateKeySpy, publicJWKeySpy, privateJWKeySpy, rawEncryptedSpy } from '../../mocks/jose/jose.mocks';
import { JWK } from 'node-jose';

function makeSut() {
  const sut = new AsymmetricKeys();

  return { sut };
}

describe('AsymmetricKeys.generateKeys', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should generate and return asymmetric keys (public and private keys)', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.generateKeys();

    // assert
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toHaveProperty('publicKey');
    expect(result.value).toHaveProperty('privateKey');
  });

  it('Should generate left error if some problem occurs while generating keys', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(crypto, 'generateKeyPairSync').mockImplementationOnce(() => { throw new Error() });

    // act
    const result = await sut.generateKeys();

    // assert
    expect(result.isLeft()).toBeTruthy();
  });

});

describe('AsymmetricKeys.getKeysAsJWKKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should transform string keys into JWK keys', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.getKeysAsJWKKey({ publicKey: PublicKeySpy, privateKey: PrivateKeySpy });

    // assert
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toHaveProperty('publicJWKey');
    expect(result.value).toHaveProperty('privateJWKey');
  });

  it('Should generate left error if some problem occurs while getting keys as JWK Keys', async () => {
    // arrange
    const { sut } = makeSut();
    jest.spyOn(JWK, 'asKey').mockImplementationOnce(() => { throw new Error() });

    // act
    const result = await sut.getKeysAsJWKKey({ publicKey: PublicKeySpy, privateKey: PrivateKeySpy });

    // assert
    expect(result.isLeft()).toBeTruthy();
  });

});