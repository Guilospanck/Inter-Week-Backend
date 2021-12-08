import { ConflictError } from "@app/errors/conflict.error";
import { InternalServerError } from "@app/errors/internalserver.error";
import { IUsersRepository } from "@app/interfaces/iusers.repository";
import { UserCreationDTO } from "@business/dtos/users/user_creation.dto";
import { UserSignupDTO } from "@business/dtos/users/user_signup.dto";
import { BaseError } from "@business/errors/base_error";
import { Either, left, right } from "@shared/utils/either";
import { SHA256 } from "crypto-js";

export class UserSignupUseCase {

  constructor(
    private readonly _userRepository: IUsersRepository
  ) { }

  async signup(user: UserSignupDTO): Promise<Either<BaseError, string>> {
    const { firstName, lastName, email, password } = user;

    // verifies if user exists
    const userExists = await this._userRepository.getUserByEmail(email);
    if (userExists.isLeft()) return left(new InternalServerError('Error trying to get email from user table.'));
    if (userExists.value) return left(new ConflictError('There is already an user with this email.'));

    // hashes passwords
    const hashedPassword = SHA256(password).toString();

    // gets last user
    const lastUser = await this._userRepository.getLastUser();
    if(lastUser.isLeft()) return left(new InternalServerError('Error trying to get last user from table.'));
    const lastWalletNumber = lastUser.value?.wallet || 0;

    const userData: UserCreationDTO = {
      ...user,
      password: hashedPassword,
      accountDigit: Math.floor(Math.random() * 99),
      accountNumber: Math.floor(Math.random() * 999999),
      wallet: lastWalletNumber + 1
    };

    // creates user
    const userCreated = await this._userRepository.createUser(userData);
    if(userCreated.isLeft()) return left(new InternalServerError('Error trying to create user.'));


    return right(userExists.value);
  }  

}