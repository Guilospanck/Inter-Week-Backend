import { ConflictError } from "@app/errors/conflict.error";
import { InternalServerError } from "@app/errors/internalserver.error";
import { IUsersRepository } from "@app/interfaces/iusers.repository";
import { UserCreationDTO } from "@business/dtos/users/user_creation.dto";
import { UserSignupDTO } from "@business/dtos/users/user_signup.dto";
import { UserSignReturn } from "@business/dtos/users/user_sign_return.dto";
import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { IAuthSignUsecase } from "@business/usecases/auth/isign.usecase";
import { IUserSignupUsecase } from "@business/usecases/users/iuser_signup.usecase";
import { Either, left, right } from "@shared/utils/either";
import { SHA256 } from "crypto-js";

export class UserSignupUseCase implements IUserSignupUsecase {

  constructor(
    private readonly _userRepository: IUsersRepository,
    private readonly _authSignUsecase: IAuthSignUsecase
  ) { }

  async signup(user: UserSignupDTO): Promise<Either<BaseError, UserSignReturn>> {
    const { email, password } = user;

    // verifies if user exists
    const userExists = await this._userRepository.getUserByEmail(email);
    if (userExists.isLeft()) return left(new InternalServerError('Error trying to get email from user table.'));
    if (userExists.value) return left(new ConflictError('There is already an user with this email.'));

    // gets last user
    const lastUser = await this._userRepository.getLastUser();
    if (lastUser.isLeft()) return left(new InternalServerError('Error trying to get last user from table.'));
    const lastWalletNumber = lastUser.value?.wallet || 100;

    // hashes passwords
    const hashedPassword = SHA256(password).toString();

    const userData: UserCreationDTO = {
      ...user,
      password: hashedPassword,
      accountDigit: Math.floor(Math.random() * 99),
      accountNumber: Math.floor(Math.random() * 999999),
      wallet: lastWalletNumber + 1
    };

    // creates user
    const userCreated = await this._userRepository.createUser(userData);
    if (userCreated.isLeft()) return left(new InternalServerError('Error trying to create user.'));

    // gets token encrypted with JOSE
    const accessToken = await this._authSignUsecase.sign(userCreated.value as User);
    if (accessToken.isLeft()) return left(new InternalServerError('Error trying to get accessToken'));

    // @ts-expect-error
    delete userData.password;

    return right(
      {
        accessToken: accessToken.value,
        user: userData
      }
    );
  }

}