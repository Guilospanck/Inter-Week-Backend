import { AuthSignUseCase } from "@app/usecases/auth/sign.usecase";
import { UserAuthenticationUsecase } from "@app/usecases/auth/user_authentication.usecase";
import { UserSigninUseCase } from "@app/usecases/users/user_signin.usecase";
import { UserSignupUseCase } from "@app/usecases/users/user_signup.usecase";
import { MiddlewareAdapter } from "@infra/adapters/express.middleware.adapter";
import { RouteAdapter } from "@infra/adapters/express.router.adapter";
import { UserRepository } from "@infra/repositories/user/user.repository";
import { UserKeysRepository } from "@infra/repositories/user_keys/user_keys.repository";
import { UserController } from "@interfaces/controllers/users/user.controller";
import { AuthenticationMiddleware } from "@interfaces/middlewares/authentication.middleware";
import { Router } from "express";

const userRouter = Router();

const userRepository = new UserRepository();
const userKeysRepository = new UserKeysRepository();
const authSignUseCase = new AuthSignUseCase(userKeysRepository);
const userSigninUseCase = new UserSigninUseCase(userRepository, authSignUseCase);
const userSignupUseCase = new UserSignupUseCase(userRepository, authSignUseCase);
const userController = new UserController(userSigninUseCase, userSignupUseCase);

userRouter.post(
  '/signin',
  RouteAdapter(userController.signin.bind(userController))
);

userRouter.post(
  '/signup',
  RouteAdapter(userController.signup.bind(userController))
);

export default userRouter;