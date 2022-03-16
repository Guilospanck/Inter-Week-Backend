import { Pix } from "@business/entities/pix";
import { getRepository, Repository } from 'typeorm';
import { Either, left, right } from '@shared/utils/either';
import { BaseError } from '@business/errors/base_error';
import { PixCreateDTO } from "@business/dtos/pix/pix_create.dto";
import { IPixRepository } from "@app/interfaces/ipix.repository";

export class PixRepository implements IPixRepository {
  private repository: Repository<Pix>;
  
  public async createPixTransaction(pixCreateDTO: PixCreateDTO): Promise<Either<BaseError, Pix | undefined>> {
    try {
      this.repository = getRepository(Pix);
      const PixCreated = await this.repository.save({ ...pixCreateDTO });
      return right(PixCreated);
    } catch (error) {
      return left(error as BaseError);
    }
  }

  public async getPixTransactionById(id: string): Promise<Either<BaseError, Pix | undefined>> {
    try {
      this.repository = getRepository(Pix);
      const pixTransactionExists = await this.repository.findOne({
        where: {
          id: id,
        }
      });
      return right(pixTransactionExists);
    } catch (error) {
      return left(error as BaseError);
    }
  }

  public async updatePixTransaction(id: string, pixCreateDTO: PixCreateDTO): Promise<Either<BaseError, Pix | undefined>> {
    try {
      this.repository = getRepository(Pix);
      const pixTransactionUpdated = await this.repository.update({ id }, { ...pixCreateDTO }).then(response => response.raw[0]);
      return right(pixTransactionUpdated);
    } catch (error) {
      return left(error as BaseError);
    }
  }

  public async getTransactionsFromRequestingUserId(requestingUserId: string): Promise<Either<BaseError, Pix[] | undefined>> {
    try {
      this.repository = getRepository(Pix);
      const pixTransactions = await this.repository.find(
        {
          where: {
            requestingUser: requestingUserId
          },
          relations: ['payingUser']
        }
      )
      return right(pixTransactions);
    } catch (error) {
      return left(error as BaseError);
    }
  }

  public async getTransactionsFromPayingUserId(payingUserId: string): Promise<Either<BaseError, Pix[] | undefined>> {
    try {
      this.repository = getRepository(Pix);
      const pixTransactions = await this.repository.find(
        {
          where: {
            payingUser: payingUserId
          },
          relations: ['requestingUser']
        }
      )
      return right(pixTransactions);
    } catch (error) {
      return left(error as BaseError);
    }
  }

  public async getAllTransactionsInvolvingUserId(userId: string): Promise<Either<BaseError, Pix[] | undefined>> {
    try {
      this.repository = getRepository(Pix);
      const pixTransactions = await this.repository.find(
        {
          where: [
            { payingUser: userId },
            { requestingUser: userId }
          ],
          relations: ['requestingUser', 'payingUser']
        }
      )
      return right(pixTransactions);
    } catch (error) {
      return left(error as BaseError);
    }
  }
}