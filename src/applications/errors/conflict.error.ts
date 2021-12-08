import { BaseError } from "@business/errors/base_error";

export class ConflictError extends Error implements BaseError {
  name = 'ConflictError';
  constructor(public readonly message: string = 'ConflictError'){
    super(message);
  }
}