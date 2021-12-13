import { NotFoundError } from "@app/errors/notfound.error";
import { IUserKeysRepository } from "@app/interfaces/iuser_keys.repository";
import { BaseError } from "@business/errors/base_error";
import { AsymmetricKeys } from "@shared/utils/asymmetric_keys";
import auth_config from "@shared/utils/auth_config";
import { Either, left, right } from "@shared/utils/either";
import { IBaseAuthenticationUsecase } from "@shared/utils/ibase_authentication.usecase";
import { Jose } from "@shared/utils/jose";
import { verify } from "jsonwebtoken";

export class UserAuthenticationUsecase implements IBaseAuthenticationUsecase {
  constructor(private readonly _userKeysRepository: IUserKeysRepository) { }

  async perform(token: string, userId: string): Promise<Either<BaseError, any>> {
    // get public and private keys from userId
    const userKeys = await this._userKeysRepository.getUserKeysByUserId(userId);
    if (userKeys.isLeft()) return left(new Error(userKeys.value.message));
    if (!userKeys.value) return left(new NotFoundError('UserKeys not found for this userId'));

    const stringPublicKey = userKeys.value.publicKey;
    const stringPrivateKey = userKeys.value.privateKey;

    // get keys as JWK keys
    const JWKeys = await AsymmetricKeys().getKeysAsJWKKey({ publicKey: stringPublicKey, privateKey: stringPrivateKey });
    if (JWKeys.isLeft()) return left(new Error(JWKeys.value.message));

    const { privateJWKey, publicJWKey } = JWKeys.value;

    // decripts Token using J.O.S.E
    const decrypted = await Jose(privateJWKey, publicJWKey).decrypt(token);
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