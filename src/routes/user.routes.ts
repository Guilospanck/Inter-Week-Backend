import { UserSigninUseCase } from "@app/usecases/users/user_signin.usecase";
import { RouteAdapter } from "@infra/adapters/express.router.adapter";
import { UserRepository } from "@infra/repositories/user/user.repository";
import { UserController } from "@interfaces/controllers/users/user.controller";
import { Router } from "express";

const userRouter = Router();

const userRepository = new UserRepository();
const userSigninUseCase = new UserSigninUseCase(userRepository);
const userController = new UserController(userSigninUseCase);

userRouter.post('/signin',
  RouteAdapter(userController.signin.bind(userController))
);

userRouter.post('/signup',
  RouteAdapter(userController.signup.bind(userController))
);

export default userRouter;