import { DatabaseConnection } from "@infra/database/database_connection";
import { HttpServer } from "@infra/http_server/http_server";
import routes from './routes';

export class AppModule {
  constructor() {
  }

  public async connectToDatabase() {
    const databaseConnection = new DatabaseConnection();
    await databaseConnection.connect();
  }

  public async initServer() {
    const httpServer = new HttpServer();
    httpServer.init();
    httpServer.registerRoutes(routes);
    httpServer.listen();
  }
}