import { IUsersRepository } from "@app/interfaces/iusers.repository";
import { UserCreationDTO } from "@business/dtos/users/user_creation.dto";
import { User } from "@business/entities/user";
import { BaseError } from "@business/errors/base_error";
import { Either } from "@shared/utils/either";

export const userSpy: User = {
  id: '13a221e8-b6f5-4b5c-9ac3-00ccaed5c6c4',
  firstName: 'potato',
  lastName: 'potato',
  accountNumber: 123456,
  accountDigit: 44,
  wallet: 500,
  email: 'batata@mail.com',
  password: 'f4610aa514477222afac2b77f971d069780ca2846f375849f3dfa3c0047ebbd1'
};

export const user2Spy: User = {
  id: '13a221f8-b6f5-4b5c-9ac3-00ccaed5c6c4',
  firstName: 'potato2',
  lastName: 'potato2',
  accountNumber: 2123456,
  accountDigit: 244,
  wallet: 2500,
  email: 'batata2@mail.com',
  password: 'f2610aa514477222afac2b77f971d069780ca2846f375849f3dfa3c0047ebbd1'
};

export const usersRepositorySpy: IUsersRepository = {
  createUser: (user: UserCreationDTO): Promise<Either<BaseError, User | undefined>> => jest.fn as any,
  getUserByEmail: (email: string): Promise<Either<BaseError, User | undefined>> => jest.fn as any,
  getUserByEmailAndPassword: (email: string, password: string): Promise<Either<BaseError, User | undefined>> => jest.fn as any,
  getLastUser: (): Promise<Either<BaseError, User | undefined>> => jest.fn as any,
  getUserById: (id: string): Promise<Either<BaseError, User | undefined>> => jest.fn as any,
  updateUser: (id: string, user: UserCreationDTO): Promise<Either<BaseError, User | undefined>> => jest.fn as any
};