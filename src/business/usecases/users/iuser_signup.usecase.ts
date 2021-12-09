import { UserSignupDTO } from "@business/dtos/users/user_signup.dto";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";

export interface IUserSignupUsecase {
  signup(user: UserSignupDTO): Promise<Either<BaseError, string>>
}