import { BaseError } from "@business/errors/base_error";

export class InternalServerError extends Error implements BaseError {
  name = 'InternalServerError';
  constructor(public readonly message: string = 'InternalServerError'){
    super(message);
  }
}