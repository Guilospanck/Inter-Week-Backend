import { HttpRequest, HttpResponse } from "@infra/http";
import { ControllerBase } from "../controller_base";

export class PixController extends ControllerBase {
  constructor(
  ) {
    super();
  }

  public async post(req: HttpRequest): Promise<HttpResponse> {
    return this.ok({ body: req.body });
  }

}