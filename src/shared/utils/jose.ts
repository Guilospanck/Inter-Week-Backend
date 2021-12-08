import { BaseError } from '@business/errors/base_error';
import { JWE, JWK } from 'node-jose';
import { Base64Util } from './base64';
import { Either, left, right } from './either';
import { generateKeyPair } from 'crypto';

type Keys = {
  publicKey: string,
  privateKey: string
}

export const Jose = (privateKey: JWK.Key, publicKey: JWK.Key) => {

  const generateKeys = (): Either<BaseError, Keys> => {
    generateKeyPair('rsa',
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
        }
      }, (err, publicKey, privateKey) => {
        if (err) return left(new Error('Error trying to generate keys.'));

        return right({
          publicKey,
          privateKey
        });

      });
  };

  const encrypt = async (raw: any): Promise<Either<BaseError, string>> => {
    if (!raw) return left(new Error('Missing raw data.'));

    try {
      const buffer = Buffer.from(JSON.stringify(raw));
      const encrypted = await JWE.createEncrypt(publicKey).update(buffer).final();
      return right(Base64Util().encode(encrypted));
    } catch (error) {
      return left(new Error('Error trying to encrypt using JOSE.'));
    }
  };

  const decrypt = async (encrypted: string): Promise<Either<BaseError, any>> => {
    if (!encrypted) return left(new Error('Missing encrypted data.'));

    try {
      const decoded = Base64Util().decode(encrypted);
      const { payload } = await JWE.createDecrypt(privateKey).decrypt(decoded as string);
      return right(JSON.parse(payload.toString()));
    } catch (error) {
      return left(new Error('Error trying to decrypt using JOSE.'));
    }

  };

};