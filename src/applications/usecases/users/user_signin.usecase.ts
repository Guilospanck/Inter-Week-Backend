import { InternalServerError } from "@app/errors/internalserver.error";
import { NotFoundError } from "@app/errors/notfound.error";
import { IUsersRepository } from "@app/interfaces/iusers.repository";

import { UserSigninDTO } from "@business/dtos/users/user_signin.dto";
import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { Either, left, right } from "@shared/utils/either";

import { SHA256 } from 'crypto-js';

export class UserSigninUseCase {

  constructor(
    private readonly _userRepository: IUsersRepository
  ) { }

  async signin(user: UserSigninDTO): Promise<Either<BaseError, User>> {
    const { email, password } = user;

    const hashedPassword = SHA256(password).toString();

    // verifies if user exists
    const userExists = await this._userRepository.getUserByEmailAndPassword(email, hashedPassword);
    if (userExists.isLeft()) return left(new InternalServerError('Error trying to get email and password from user table.'));
    if (!userExists.value) return left(new NotFoundError('There is no User with this email and password.'));

    return right(userExists.value);
  }

}