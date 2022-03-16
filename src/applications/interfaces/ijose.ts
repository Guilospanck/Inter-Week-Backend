import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";
import { JWK } from "node-jose";

export interface IJose {
  encrypt: (raw: string, publicKey: JWK.Key) => Promise<Either<BaseError, string>>,
  decrypt: (encrypted: string, privateKey: JWK.Key) => Promise<Either<BaseError, string>>
}