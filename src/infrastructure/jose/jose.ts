import { BaseError } from '@business/errors/base_error';
import { JWE, JWK } from 'node-jose';
import { Base64Util } from '@shared_utils/base64';
import { Either, left, right } from '@shared_utils/either';
import { IJose } from '@app/interfaces/ijose';

export class Jose implements IJose {
  async encrypt(raw: string, publicKey: JWK.Key): Promise<Either<BaseError, string>> {
    if (!raw) return left(new Error('Missing raw data.'));

    try {
      const buffer = Buffer.from(JSON.stringify(raw));
      const encrypted = await JWE.createEncrypt(publicKey).update(buffer).final();
      return right(Base64Util().encode(encrypted));
    } catch (error) {
      return left(new Error('Error trying to encrypt using JOSE.'));
    }
  }

  async decrypt(encrypted: string, privateKey: JWK.Key): Promise<Either<BaseError, string>> {
    if (!encrypted) return left(new Error('Missing encrypted data.'));

    try {
      const decoded = Base64Util().decode(encrypted);
      const { payload } = await JWE.createDecrypt(privateKey).decrypt(decoded as string);
      return right(JSON.parse(payload.toString()));
    } catch (error) {
      return left(new Error('Error trying to decrypt using JOSE.'));
    }
  }

}