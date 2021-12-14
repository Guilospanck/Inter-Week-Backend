import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";
import { JWK } from "node-jose";

export type Keys = {
  publicKey: string,
  privateKey: string
};

export type JWKeys = {
  privateJWKey: JWK.Key,
  publicJWKey: JWK.Key,
};

export interface IAsymmetricKeys {
  generateKeys: () => Either<BaseError, Keys>,
  getKeysAsJWKKey: (keys: Keys) => Promise<Either<BaseError, JWKeys>>
}