import { User } from "@business/entities/user";

export interface UserSignReturn {
  accessToken: string,
  user: Partial<User>
}
