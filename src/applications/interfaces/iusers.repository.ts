import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";

export interface IUsersRepository {
  getUserByEmailAndPassword: (email: string, password: string) => Promise<Either<BaseError, User | undefined>>
}