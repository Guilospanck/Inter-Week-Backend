import { Pix } from "@business/entities/pix";
import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";

export interface IPixGetAllTransactionsFromUser {
  get: (user: Partial<User>) => Promise<Either<BaseError, Pix[] | undefined>>
}