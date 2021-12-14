import { UserAuthenticationUsecase } from "@app/usecases/auth/user_authentication.usecase";
import { PixPayUsecase } from "@app/usecases/pix/pix_pay.usecase";
import { PixRequestUsecase } from "@app/usecases/pix/pix_request.usecase";
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
const pixController = new PixController(pixRequestUsecase, pixPayUsecase);

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

export default pixRouter;