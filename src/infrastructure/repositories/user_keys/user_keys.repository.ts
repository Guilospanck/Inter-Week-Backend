import { getRepository, Repository } from 'typeorm';
import { Either, left, right } from '@shared/utils/either';
import { BaseError } from '@business/errors/base_error';
import { UserKeys } from '@business/entities/user_keys';
import { UserKeysCreationDTO } from '@business/dtos/user_keys/user_keys_creation.dto';
import { IUserKeysRepository } from '@app/interfaces/iuser_keys.repository';

export class UserKeysRepository implements IUserKeysRepository {
  private repository: Repository<UserKeys>;
  constructor() { }

  public async createUserKeys(userKeysDTO: UserKeysCreationDTO): Promise<Either<BaseError, UserKeys | undefined>> {
    try {
      this.repository = getRepository(UserKeys);
      const userKeysCreated = await this.repository.save(userKeysDTO);
      return right(userKeysCreated);
    } catch (error) {
      return left(error as BaseError);
    }
  }

  // public async getLastUser(): Promise<Either<BaseError, User | undefined>> {
  //   try {
  //     this.repository = getRepository(User);
  //     const lastUser = await this.repository.findOne({
  //       order: {
  //         id: 'DESC'
  //       }
  //     });
  //     return right(lastUser);
  //   } catch (error) {
  //     return left(error as BaseError);
  //   }
  // }


  // public async getUserByEmail(email: string): Promise<Either<BaseError, User | undefined>> {
  //   try {
  //     this.repository = getRepository(User);
  //     const userExists = await this.repository.findOne({
  //       where: {
  //         email,
  //       }
  //     });
  //     return right(userExists);
  //   } catch (error) {
  //     return left(error as BaseError);
  //   }
  // }

  // public async getUserByEmailAndPassword(email: string, password: string): Promise<Either<BaseError, User | undefined>> {
  //   try {
  //     this.repository = getRepository(User);
  //     const userExists = await this.repository.findOne({
  //       where: {
  //         email,
  //         password
  //       }
  //     });
  //     return right(userExists);
  //   } catch (error) {
  //     return left(error as BaseError);
  //   }
  // }

}