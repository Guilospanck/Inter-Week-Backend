import { BaseError } from '@business/errors/base_error';
import { generateKeyPairSync } from 'crypto';
import { JWK } from 'node-jose';
import { Either, left, right } from './either';

type Keys = {
  publicKey: string,
  privateKey: string
}

type JWKeys = {
  privateJWKey: JWK.Key,
  publicJWKey: JWK.Key,
}

export const AsymmetricKeys = () => {

  const generateKeys = (): Either<BaseError, Keys> => {
    try {
      const {
        publicKey, privateKey
      } = generateKeyPairSync('rsa',
        {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
          }
        });

      return right({
        publicKey,
        privateKey
      });
    } catch (error) {
      return left(new Error('Error trying to generate key pair.'));
    }
  };

  const getKeysAsJWKKey = async (keys: Keys): Promise<Either<BaseError, JWKeys>> => {
    try {
      const { publicKey, privateKey } = keys;   
  
      const privateJWKey = await JWK.asKey(privateKey, 'pem');
      const publicJWKey = await JWK.asKey(publicKey, 'pem');
  
      return right({
        privateJWKey,
        publicJWKey
      });
      
    } catch (error) {
      return left(new Error('Error trying to get string keys as JWK.Key'));
    }
  };

  return {
    generateKeys,
    getKeysAsJWKKey
  };
}