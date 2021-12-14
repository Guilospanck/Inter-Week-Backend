import { InternalServerError } from "@app/errors/internalserver.error";
import { NotFoundError } from "@app/errors/notfound.error";
import { IPixRepository } from "@app/interfaces/ipix.repository";
import { IUsersRepository } from "@app/interfaces/iusers.repository";
import { PixCreateDTO } from "@business/dtos/pix/pix_create.dto";
import { PixReturnDTO } from "@business/dtos/pix/pix_return.dto";
import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { IPixRequestUsecase } from "@business/usecases/pix/ipix_request.usecase";
import { Either, left, right } from "@shared/utils/either";
import { PixEncodeDecodeUtils } from "@shared/utils/pix";

export class PixRequestUsecase implements IPixRequestUsecase {
  constructor(
    private readonly _usersRepository: IUsersRepository,
    private readonly _pixRepository: IPixRepository
  ) { }

  async request(value: number, user: Partial<User>): Promise<Either<BaseError, PixReturnDTO>> {
    // verifies if user exists
    const userExists = await this._usersRepository.getUserByEmail(user.email as string);
    if (userExists.isLeft()) return left(new InternalServerError('Error trying to get user.'));
    if (!userExists.value) return left(new NotFoundError('There is no User with this email.'));

    const requestingUserId = userExists.value.id;

    // creates Pix transaction
    const pixCreateDTO: PixCreateDTO = {
      status: 'open',
      value,
      requestingUserId
    };
    const pixTransactionCreated = await this._pixRepository.createPixTransaction(pixCreateDTO);
    if (pixTransactionCreated.isLeft()) return left(new InternalServerError('Error trying to save Pix transaction.'));

    const pixTransactionId = pixTransactionCreated.value?.id;

    // encodes pix key
    const pixKeyEncoded = PixEncodeDecodeUtils().encode(requestingUserId, value, pixTransactionId as string);

    return right({
      pixKey: pixKeyEncoded,
      status: 'open'
    });
  }
}