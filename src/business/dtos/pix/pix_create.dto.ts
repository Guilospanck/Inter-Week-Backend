import { User } from "@business/entities/user";

export interface PixCreateDTO {
  status: string,
  value: number,
  requestingUser?: User,
  payingUser?: User,
}