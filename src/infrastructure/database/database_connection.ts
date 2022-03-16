import { createConnection } from "typeorm";

export class DatabaseConnection {
  async connect(){
    await createConnection();
  }
}