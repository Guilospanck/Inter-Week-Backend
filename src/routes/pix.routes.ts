import { UserAuthenticationUsecase } from "@app/usecases/auth/user_authentication.usecase";
import { PixGetAllTransactionsFromUser } from "@app/usecases/pix/pix_get_all_transactions_from_user.usecase";
import { PixPayUsecase } from "@app/usecases/pix/pix_pay.usecase";
import { PixRequestUsecase } from "@app/usecases/pix/pix_request.usecase";
import { PixTransactionAsPayingUserUsecase } from "@app/usecases/pix/pix_transactions_as_paying_user.usecase";
import { PixTransactionAsRequestingUserUsecase } from "@app/usecases/pix/pix_transactions_as_requesting_user.usecase";
import { MiddlewareAdapter } from "@infra/adapters/express.middleware.adapter";
import { RouteAdapter } from "@infra/adapters/express.router.adapter";
import { PixRepository } from "@infra/repositories/pix/pix.repository";
import { UserRepository } from "@infra/repositories/user/user.repository";
import { UserKeysRepository } from "@infra/repositories/user_keys/user_keys.repository";
import { PixController } from "@interfaces/controllers/pix/pix.controller";
import { AuthenticationMiddleware } from "@interfaces/middlewares/authentication.middleware";
import { Router } from "express";

const pixRouter = Router();

const userKeysRepository = new UserKeysRepository();
const userRepository = new UserRepository();

const pixRepository = new PixRepository();
const pixRequestUsecase = new PixRequestUsecase(userRepository, pixRepository);
const pixPayUsecase = new PixPayUsecase(userRepository, pixRepository);
const pixTransactionAsRequestingUserUsecase = new PixTransactionAsRequestingUserUsecase(userRepository, pixRepository);
const pixTransactionAsPayingUserUsecase = new PixTransactionAsPayingUserUsecase(userRepository, pixRepository);
const pixGetAllTransactionsFromUser = new PixGetAllTransactionsFromUser(userRepository, pixRepository);
const pixController = new PixController(pixRequestUsecase,
  pixPayUsecase, pixTransactionAsRequestingUserUsecase, pixTransactionAsPayingUserUsecase,
  pixGetAllTransactionsFromUser);

const userAuthenticationUseCase = new UserAuthenticationUsecase(userKeysRepository);
const authenticationMiddleware = new AuthenticationMiddleware(userAuthenticationUseCase);

pixRouter.post(
  '/request',
  MiddlewareAdapter(authenticationMiddleware),
  RouteAdapter(pixController.request.bind(pixController))
);

pixRouter.post(
  '/pay',
  MiddlewareAdapter(authenticationMiddleware),
  RouteAdapter(pixController.pay.bind(pixController))
);

pixRouter.get(
  '/transactions/requestinguser',
  MiddlewareAdapter(authenticationMiddleware),
  RouteAdapter(pixController.getTransactionsAsRequestingUser.bind(pixController))
);

pixRouter.get(
  '/transactions/payinguser',
  MiddlewareAdapter(authenticationMiddleware),
  RouteAdapter(pixController.getTransactionsAsPayingUser.bind(pixController))
);

pixRouter.get(
  '/transactions/all',
  MiddlewareAdapter(authenticationMiddleware),
  RouteAdapter(pixController.getAllTransactionsInvolvingUser.bind(pixController))
);

export default pixRouter;