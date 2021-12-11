import { InternalServerError } from "@app/errors/internalserver.error";
import { NotFoundError } from "@app/errors/notfound.error";
import { IUsersRepository } from "@app/interfaces/iusers.repository";

import { UserSigninDTO } from "@business/dtos/users/user_signin.dto";
import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { IAuthSignUsecase } from "@business/usecases/auth/isign.usecase";
import { IUserSigninUsecase } from "@business/usecases/users/iuser_signin.usecase";
import { Either, left, right } from "@shared/utils/either";

import { SHA256 } from 'crypto-js';

export class UserSigninUseCase implements IUserSigninUsecase {

  constructor(
    private readonly _userRepository: IUsersRepository,
    private readonly _authSignUsecase: IAuthSignUsecase
  ) { }

  async signin(user: UserSigninDTO): Promise<Either<BaseError, string>> {
    const { email, password } = user;

    const hashedPassword = SHA256(password).toString();

    // verifies if user exists
    const userExists = await this._userRepository.getUserByEmailAndPassword(email, hashedPassword);
    if (userExists.isLeft()) return left(new InternalServerError('Error trying to get email and password from user table.'));
    if (!userExists.value) return left(new NotFoundError('There is no User with this email and password.'));

    // gets token encrypted with JOSE
    const accessToken = await this._authSignUsecase.sign(userExists.value as User);
    if(accessToken.isLeft()) return left(new InternalServerError('Error trying to get accessToken'));

    return right(accessToken.value);
  }

}