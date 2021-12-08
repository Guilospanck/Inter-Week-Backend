import { UserCreationDTO } from "@business/dtos/users/user_creation.dto";
import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";

export interface IUsersRepository {
  createUser: (user: UserCreationDTO) => Promise<Either<BaseError, User | undefined>>
  getUserByEmail: (email: string) => Promise<Either<BaseError, User | undefined>>
  getUserByEmailAndPassword: (email: string, password: string) => Promise<Either<BaseError, User | undefined>>
  getLastUser: () => Promise<Either<BaseError, User | undefined>>
}