import { PixReturnDTO } from "@business/dtos/pix/pix_return.dto";
import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";

export interface IPixRequestUsecase {
  request: (value: number, user: Partial<User>) => Promise<Either<BaseError, PixReturnDTO>>
}