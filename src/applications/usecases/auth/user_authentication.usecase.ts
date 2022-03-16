import { NotFoundError } from "@app/errors/notfound.error";
import { IAsymmetricKeys } from "@app/interfaces/iasymmetric_keys";
import { IJose } from "@app/interfaces/ijose";
import { IUserKeysRepository } from "@app/interfaces/iuser_keys.repository";
import { BaseError } from "@business/errors/base_error";
import auth_config from "@shared/utils/auth_config";
import { Either, left, right } from "@shared/utils/either";
import { IBaseAuthenticationUsecase } from "@shared/utils/ibase_authentication.usecase";
import { JwtPayload, verify } from "jsonwebtoken";

export class UserAuthenticationUsecase implements IBaseAuthenticationUsecase {
  constructor(
    private readonly _userKeysRepository: IUserKeysRepository,
    private readonly _jose: IJose,
    private readonly _asymmetricKeys: IAsymmetricKeys
  ) { }

  async perform(token: string, userId: string): Promise<Either<BaseError, string | JwtPayload>> {
    // get public and private keys from userId
    const userKeys = await this._userKeysRepository.getUserKeysByUserId(userId);
    if (userKeys.isLeft()) return left(new Error(userKeys.value.message));
    if (!userKeys.value) return left(new NotFoundError('UserKeys not found for this userId'));

    const stringPublicKey = userKeys.value.publicKey;
    const stringPrivateKey = userKeys.value.privateKey;

    // get keys as JWK keys
    const JWKeys = await this._asymmetricKeys.getKeysAsJWKKey({ publicKey: stringPublicKey, privateKey: stringPrivateKey });
    if (JWKeys.isLeft()) return left(new Error(JWKeys.value.message));

    const { privateJWKey } = JWKeys.value;

    // decripts Token using J.O.S.E
    const decrypted = await this._jose.decrypt(token, privateJWKey);
    if (decrypted.isLeft()) return left(new Error(decrypted.value.message));

    try {
      // validates token
      const validated = verify(decrypted.value, auth_config.jwt.secret);
      return right(validated);
    } catch (error) {
      return left(new Error(error as string));
    }
  }

}