import { UserAuthenticationUsecase } from "@app/usecases/auth/user_authentication.usecase";
import { MiddlewareAdapter } from "@infra/adapters/express.middleware.adapter";
import { RouteAdapter } from "@infra/adapters/express.router.adapter";
import { UserKeysRepository } from "@infra/repositories/user_keys/user_keys.repository";
import { PixController } from "@interfaces/controllers/pix/pix.controller";
import { AuthenticationMiddleware } from "@interfaces/middlewares/authentication.middleware";
import { Router } from "express";

const pixRouter = Router();

const userKeysRepository = new UserKeysRepository();
const pixController = new PixController();

const userAuthenticationUseCase = new UserAuthenticationUsecase(userKeysRepository);
const authenticationMiddleware = new AuthenticationMiddleware(userAuthenticationUseCase);

pixRouter.post(
  '/',  
  MiddlewareAdapter(authenticationMiddleware),
  RouteAdapter(pixController.post.bind(pixController))
);

export default pixRouter;