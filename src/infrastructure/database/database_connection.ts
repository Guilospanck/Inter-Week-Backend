import { createConnection } from "typeorm";

export class DatabaseConnection {
  constructor(){}

  async connect(){
    await createConnection();
  }
}