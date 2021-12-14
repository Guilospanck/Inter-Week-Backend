import { InternalServerError } from "@app/errors/internalserver.error";
import { NotFoundError } from "@app/errors/notfound.error";
import { IPixRepository } from "@app/interfaces/ipix.repository";
import { IUsersRepository } from "@app/interfaces/iusers.repository";
import { Pix } from "@business/entities/pix";
import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { IPixTransactionAsPayingUserUsecase } from "@business/usecases/pix/ipix_transactions_as_paying_user.usecase";
import { Either, left, right } from "@shared/utils/either";

export class PixTransactionAsPayingUserUsecase implements IPixTransactionAsPayingUserUsecase {
  constructor(
    private readonly _usersRepository: IUsersRepository,
    private readonly _pixRepository: IPixRepository
  ) { }

  async get(user: Partial<User>): Promise<Either<BaseError, Pix[] | undefined>> {
    // verifies if user exists
    const userExists = await this._usersRepository.getUserByEmail(user.email as string);
    if (userExists.isLeft()) return left(new InternalServerError('Error trying to get user.'));
    if (!userExists.value) return left(new NotFoundError('There is no User with this email.'));

    // gets transactions that have this user as payingUser
    const pixTransactions = await this._pixRepository.getTransactionsFromPayingUserId(userExists.value.id);
    if (pixTransactions.isLeft()) return left(new InternalServerError('Error trying to get Pix transactions.'));

    try {
      // deletes password from response and returns data sorted by date
      const response = pixTransactions.value?.map((data) => {
        // @ts-expect-error
        delete data?.requestingUser?.password;
        return data;
      }).sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateA < dateB ? 1 : -1;
      });
  
      return right(response);      
    } catch (error) {
      return left(new Error('Error trying to delete password from response and sort it'));
    }
  }
}