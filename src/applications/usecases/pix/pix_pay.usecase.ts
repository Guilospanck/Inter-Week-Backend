import { BadRequestError } from "@app/errors/badrequest.error";
import { ConflictError } from "@app/errors/conflict.error";
import { InternalServerError } from "@app/errors/internalserver.error";
import { NotFoundError } from "@app/errors/notfound.error";
import { IPixRepository } from "@app/interfaces/ipix.repository";
import { IUsersRepository } from "@app/interfaces/iusers.repository";
import { PixCreateDTO } from "@business/dtos/pix/pix_create.dto";
import { PixReturnDTO } from "@business/dtos/pix/pix_return.dto";
import { UserCreationDTO } from "@business/dtos/users/user_creation.dto";
import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { IPixPayUsecase } from "@business/usecases/pix/ipix_pay.usecase";
import { Either, left, right } from "@shared/utils/either";
import { PixEncodeDecodeUtils } from "@shared/utils/pix";

export class PixPayUsecase implements IPixPayUsecase {
  constructor(
    private readonly _usersRepository: IUsersRepository,
    private readonly _pixRepository: IPixRepository
  ) { }

  async pay(pixKeyEncoded: string, user: Partial<User>): Promise<Either<BaseError, PixReturnDTO>> {
    // verifies if pix transaction exists
    const { requestingUserId, value, pixTransactionId } = PixEncodeDecodeUtils().decode(pixKeyEncoded);

    const pixTransactionExists = await this._pixRepository.getPixTransactionById(pixTransactionId);
    if (pixTransactionExists.isLeft()) return left(new InternalServerError('Error trying to get pix transaction.'));
    if (!pixTransactionExists.value) return left(new NotFoundError('There is no Pix transaction with this id.'));

    // verifies if pix transaction is on 'open' state yet
    if(pixTransactionExists.value.status !== 'open') return left(new BadRequestError('Pix transaction already paid.'));

    // verifies if requesting user exists
    const requestingUserExits = await this._usersRepository.getUserById(requestingUserId);
    if (requestingUserExits.isLeft()) return left(new InternalServerError('Error trying to get requesting user.'));
    if (!requestingUserExits.value) return left(new NotFoundError('This requesting User doesn\'t exist.'));

    // verfies if paying user exists
    const payingUserExists = await this._usersRepository.getUserById(user.id as string);
    if (payingUserExists.isLeft()) return left(new InternalServerError('Error trying to get paying user.'));
    if (!payingUserExists.value) return left(new NotFoundError('This paying User doesn\'t exist.'));

    // verifies if paying user is different from requesting user
    if(payingUserExists.value.id === requestingUserId) return left(new ConflictError('User can\'t pay to himself.'));

    // verifies if paying user has enough money in the wallet to pay the pix transaction value
    if (parseInt(value) > payingUserExists.value.wallet) return left(new BadRequestError('Paying User has not enought money to pay Pix transaction.'));

    // updates pix transaction
    const pixUpdateDTO: PixCreateDTO = {
      ...pixTransactionExists.value,
      payingUser: payingUserExists.value,
      status: 'closed'
    };
    const pixTransactionUpdated = await this._pixRepository.updatePixTransaction(pixTransactionId, pixUpdateDTO);
    if (pixTransactionUpdated.isLeft()) return left(new InternalServerError('Error trying to update Pix transaction.'));

    // updates wallet of paying and requesting Users
    const updatingRequestingUserDTO: UserCreationDTO = {
      ...requestingUserExits.value,
      wallet: requestingUserExits.value.wallet + parseInt(value)
    };
    const updatedRequestingUser = await this._usersRepository.updateUser(requestingUserId, updatingRequestingUserDTO);
    if (updatedRequestingUser.isLeft()) return left(new InternalServerError('Error trying to update Requesting User wallet.'));

    const updatingPayingUserDTO: UserCreationDTO = {
      ...payingUserExists.value,
      wallet: payingUserExists.value.wallet - parseInt(value)
    };
    const updatedPayingUser = await this._usersRepository.updateUser(user.id as string, updatingPayingUserDTO);
    if (updatedPayingUser.isLeft()) return left(new InternalServerError('Error trying to update Paying User wallet.'));

    return right({
      pixKey: pixTransactionExists.value.id,
      status: pixUpdateDTO.status
    })
  }
}