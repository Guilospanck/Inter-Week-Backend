import { BaseError } from "@business/errors/base_error";
import { JwtPayload } from "jsonwebtoken";
import { Either } from "./either";

export interface IBaseAuthenticationUsecase {
  perform(token: string, userId: string): Promise<Either<BaseError, string | JwtPayload>>
}