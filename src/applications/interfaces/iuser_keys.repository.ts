import { UserKeysCreationDTO } from "@business/dtos/user_keys/user_keys_creation.dto";
import { UserKeys } from "@business/entities/user_keys";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";

export interface IUserKeysRepository {
  createUserKeys: (userKeysDTO: UserKeysCreationDTO) => Promise<Either<BaseError, UserKeys | undefined>>,
  getUserKeysByUserId: (userId: string) => Promise<Either<BaseError, UserKeys | undefined>>,
  updateUserKeys: (id: string, userKeysDTO: UserKeysCreationDTO) => Promise<Either<BaseError, UserKeys | undefined>>
}