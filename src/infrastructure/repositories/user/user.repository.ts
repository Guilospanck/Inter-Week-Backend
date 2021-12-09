import { getRepository, Repository } from 'typeorm';
import { User } from '@business/entities/user';
import { Either, left, right } from '@shared/utils/either';
import { BaseError } from '@business/errors/base_error';
import { IUsersRepository } from '@app/interfaces/iusers.repository';
import { UserCreationDTO } from '@business/dtos/users/user_creation.dto';

export class UserRepository implements IUsersRepository {
  private repository: Repository<User>;
  constructor() { }

  public async createUser(user: UserCreationDTO): Promise<Either<BaseError, User | undefined>> {
    try {
      this.repository = getRepository(User);
      const userCreated = await this.repository.save(user);
      return right(userCreated);
    } catch (error) {
      return left(error as BaseError);
    }
  }

  public async getLastUser(): Promise<Either<BaseError, User | undefined>> {
    try {
      this.repository = getRepository(User);
      const lastUser = await this.repository.findOne({
        order: {
          id: 'DESC'
        }
      });
      return right(lastUser);
    } catch (error) {
      return left(error as BaseError);
    }
  }


  public async getUserByEmail(email: string): Promise<Either<BaseError, User | undefined>> {
    try {
      this.repository = getRepository(User);
      const userExists = await this.repository.findOne({
        where: {
          email,
        }
      });
      return right(userExists);
    } catch (error) {
      return left(error as BaseError);
    }
  }

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