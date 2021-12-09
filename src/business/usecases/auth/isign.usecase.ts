import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";

export interface IAuthSignUsecase {
  sign(user: User): Promise<Either<BaseError, string>>
}