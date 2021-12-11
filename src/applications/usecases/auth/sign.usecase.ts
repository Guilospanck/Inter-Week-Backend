import { sign } from 'jsonwebtoken';
import { User } from '@business/entities/user';

import auth_config from '@shared/utils/auth_config';
import { AsymmetricKeys } from '@shared/utils/asymmetric_keys';
import { Either, left, right } from '@shared/utils/either';
import { BaseError } from '@business/errors/base_error';
import { Jose } from '@shared/utils/jose';
import { IAuthSignUsecase } from '@business/usecases/auth/isign.usecase';
import { IUserKeysRepository } from '@app/interfaces/iuser_keys.repository';
import { UserKeysCreationDTO } from '@business/dtos/user_keys/user_keys_creation.dto';

export class AuthSignUseCase implements IAuthSignUsecase {
  constructor(private readonly _userKeysRepository: IUserKeysRepository) { }

  async sign(userData: User): Promise<Either<BaseError, string>> {
    const user = { ...userData };

    // @ts-expect-error
    delete user.password;

    // gets JWT Token
    const { secret, expiresIn } = auth_config.jwt;
    const token = sign(user, secret, {
      subject: user.id.toString(),
      expiresIn
    });

    // gets Asymmetric keys
    const keys = AsymmetricKeys().generateKeys();
    if (keys.isLeft()) return left(new Error(keys.value.message));

    // get asymmetric keys as JWK.Key
    const jwKeys = await AsymmetricKeys().getKeysAsJWKKey(keys.value);
    if (jwKeys.isLeft()) return left(new Error(jwKeys.value.message));

    // applies JOSE to the token
    const publicKey = jwKeys.value.publicJWKey;
    const privateKey = jwKeys.value.privateJWKey;
    const encrypted = await Jose(privateKey, publicKey).encrypt(token);
    if (encrypted.isLeft()) return left(new Error(encrypted.value.message));

    // creates the object to be saved/updated
    const userKeysData: UserKeysCreationDTO = {
      user: userData,
      publicKey: keys.value.publicKey,
      privateKey: keys.value.privateKey,
    };

    // verifies if userKeys for this user already exists
    const userKeysExists = await this._userKeysRepository.getUserKeysByUserId(userData.id);
    if(userKeysExists.isLeft()) return left(new Error(userKeysExists.value.message));
    
    // if it does, just update it
    if(userKeysExists.value) {
      const userKeysUpdated = await this._userKeysRepository.updateUserKeys(userKeysExists.value?.id, userKeysData);
      if(userKeysUpdated.isLeft()) return left(new Error(userKeysUpdated.value.message));
    } else {
      // otherwise, creates a new one
      const userKeysCreated = await this._userKeysRepository.createUserKeys(userKeysData);
      if(userKeysCreated.isLeft()) return left(new Error(userKeysCreated.value.message));
    }

    return right(encrypted.value);
  }
}