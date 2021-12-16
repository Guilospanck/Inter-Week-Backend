import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { IAuthSignUsecase } from "@business/usecases/auth/isign.usecase";
import { Either } from "@shared/utils/either";

export const authSignUseCaseSpy: IAuthSignUsecase = {
  sign: (user: User): Promise<Either<BaseError, string>> => jest.fn as any
}