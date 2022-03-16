import { IAsymmetricKeys, JWKeys, Keys } from "@app/interfaces/iasymmetric_keys";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";

import { PublicKeySpy, PrivateKeySpy } from '../jose/jose.mocks';

export const keysSpy: Keys = {
  publicKey: PublicKeySpy,
  privateKey: PrivateKeySpy
};

export const asymmetricKeysSpy: IAsymmetricKeys = {
  generateKeys: (): Either<BaseError, Keys> => jest.fn as any,
  getKeysAsJWKKey: (_keys: Keys): Promise<Either<BaseError, JWKeys>> => jest.fn as any
}