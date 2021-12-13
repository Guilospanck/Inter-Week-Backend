import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { Either, right } from "@shared/utils/either";

export class PixRequestUsecase {
  constructor() { }

  async request(value: number, user: Partial<User>): Promise<Either<BaseError, string>> {

    

    return right('true');


  }
}