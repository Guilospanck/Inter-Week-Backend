import { ConflictError } from '@app/errors/conflict.error';
import { NotFoundError } from '@app/errors/notfound.error';
import { IUserSigninUsecase } from '@business/usecases/users/iuser_signin.usecase';
import { IUserSignupUsecase } from '@business/usecases/users/iuser_signup.usecase';
import { HttpRequest, HttpResponse } from '@infra/http';
import { ControllerBase } from '../controller_base';

export class UserController extends ControllerBase {
  constructor(
    private readonly _userSignInUseCase: IUserSigninUsecase,
    private readonly _userSignupUsecase: IUserSignupUsecase
  ) {
    super();
  }

  public async signin(req: HttpRequest): Promise<HttpResponse> {
    const result = await this._userSignInUseCase.signin(req.body);
    if (result.isLeft()) {
      switch (result.value.constructor) {
        case NotFoundError:
          return this.notFound({ body: result.value.message });
        default:
          return this.internalServerError({ body: result.value.message })
      }
    }
    return this.ok({ body: result.value });
  }

  public async signup(req: HttpRequest): Promise<HttpResponse> {
    const result = await this._userSignupUsecase.signup(req.body);
    if (result.isLeft()) {
      switch (result.value.constructor) {
        case ConflictError:
          return this.conflict({ body: result.value.message });
        default:
          return this.internalServerError({ body: result.value.message })
      }
    }
    return this.ok({ body: result.value });
  }
}