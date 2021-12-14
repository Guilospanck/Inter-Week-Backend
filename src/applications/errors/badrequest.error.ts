import { BaseError } from "@business/errors/base_error";

export class BadRequestError extends Error implements BaseError {
  name = 'BadRequestError';
  constructor(public readonly message: string = 'BadRequestError'){
    super(message);
  }
}