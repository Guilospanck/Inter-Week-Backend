import { PixCreateDTO } from "@business/dtos/pix/pix_create.dto";
import { Pix } from "@business/entities/pix";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";

export interface IPixRepository {
  createPixTransaction: (pixCreateDTO: PixCreateDTO) => Promise<Either<BaseError, Pix | undefined>>,
  getPixTransactionById: (id: string) => Promise<Either<BaseError, Pix | undefined>>,
  updatePixTransaction: (id: string, pixCreateDTO: PixCreateDTO) => Promise<Either<BaseError, Pix | undefined>>
}