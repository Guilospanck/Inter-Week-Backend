import { getRepository, Repository } from 'typeorm';
import { User } from '@business/entities/user';
import { Either, left, right } from '@shared/utils/either';
import { BaseError } from '@business/errors/base_error';
import { IUsersRepository } from '@app/interfaces/iusers.repository';

export class UserRepository implements IUsersRepository {
  private repository: Repository<User>;
  constructor() {}

  public async getUserByEmailAndPassword(email: string, password: string): Promise<Either<BaseError, User | undefined>> {
    try {
      this.repository = getRepository(User);
      const userExists = await this.repository.findOne({
        where: {
          email,
          password
        }
      });
      return right(userExists);
    } catch (error) {
      return left(error as BaseError);
    }
  }

}