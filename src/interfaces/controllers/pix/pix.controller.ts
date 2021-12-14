import { NotFoundError } from "@app/errors/notfound.error";
import { IPixRequestUsecase } from "@business/usecases/pix/ipix_request.usecase";
import { HttpRequest, HttpResponse } from "@infra/http";
import { ControllerBase } from "../controller_base";

export class PixController extends ControllerBase {
  constructor(
    private readonly _pixRequestUsecase: IPixRequestUsecase
  ) {
    super();
  }

  public async request(req: HttpRequest): Promise<HttpResponse> {
    const value = req.body.value;
    const userPartial = req.auth;
    const result = await this._pixRequestUsecase.request(value, userPartial);
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

}