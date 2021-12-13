import { BaseError } from "@business/errors/base_error";
import { Either } from "./either";

export interface IBaseAuthenticationUsecase {
  perform(token: string, userId: string): Promise<Either<BaseError, any>>
}