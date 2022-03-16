import { IUserKeysRepository } from "@app/interfaces/iuser_keys.repository";
import { UserKeysCreationDTO } from "@business/dtos/user_keys/user_keys_creation.dto";
import { UserKeys } from "@business/entities/user_keys";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";
import { PrivateKeySpy, PublicKeySpy } from "../jose/jose.mocks";
import { userSpy } from "../users/users.mocks";

export const userKeysCreateDTOSpy: UserKeysCreationDTO = {
  user: userSpy,
  publicKey: PublicKeySpy,
  privateKey: PrivateKeySpy
};

export const userKeysSpy: UserKeys = {
  id: '650db259-7f16-4283-a64a-57e87fa65165',
  publicKey: PublicKeySpy,
  privateKey: PrivateKeySpy,
  user: userSpy
};

export const userKeysRepositorySpy: IUserKeysRepository = {
  createUserKeys: (_userKeysDTO: UserKeysCreationDTO): Promise<Either<BaseError, UserKeys | undefined>> => jest.fn as any,
  getUserKeysByUserId: (_userId: string): Promise<Either<BaseError, UserKeys | undefined>> => jest.fn as any,
  updateUserKeys: (_id: string, _userKeysDTO: UserKeysCreationDTO): Promise<Either<BaseError, UserKeys | undefined>> => jest.fn as any,
};