import { User } from "@business/entities/user";

export interface UserKeysCreationDTO {
  user: User;
  publicKey: string;
  privateKey: string;
}