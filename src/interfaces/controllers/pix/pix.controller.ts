import { BadRequestError } from "@app/errors/badrequest.error";
import { ConflictError } from "@app/errors/conflict.error";
import { NotFoundError } from "@app/errors/notfound.error";
import { IPixPayUsecase } from "@business/usecases/pix/ipix_pay.usecase";
import { IPixRequestUsecase } from "@business/usecases/pix/ipix_request.usecase";
import { HttpRequest, HttpResponse } from "@infra/http";
import { ControllerBase } from "../controller_base";

export class PixController extends ControllerBase {
  constructor(
    private readonly _pixRequestUsecase: IPixRequestUsecase,
    private readonly _pixPayUsecase: IPixPayUsecase,
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
    return this.ok({ body: result.value });5
  }

  public async pay(req: HttpRequest): Promise<HttpResponse> {
    const key = req.body.key;
    const userPartial = req.auth;
    const result = await this._pixPayUsecase.pay(key, userPartial);
    if (result.isLeft()) {
      switch (result.value.constructor) {
        case NotFoundError:
          return this.notFound({ body: result.value.message });
        case BadRequestError:
          return this.badRequest({ body: result.value.message });
        case ConflictError:
          return this.conflict({ body: result.value.message });
        default:
          return this.internalServerError({ body: result.value.message })
      }
    }
    return this.ok({ body: result.value });
  }

}