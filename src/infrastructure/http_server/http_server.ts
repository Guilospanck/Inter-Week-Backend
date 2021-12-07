import express, { Application, Router } from "express";

export class HttpServer {

  private readonly _server: Application;

  constructor() {
    this._server = express();
  }

  public init() {
    this._server.use(express.json());
  }

  public registerRoutes(routes: Router) {
    this._server.use(routes)
  }

  public listen() {
    const PORT = 4444;
    this._server.listen(PORT, () => {
      console.log(`[Server]: Server is running at http://localhost:${PORT}`);
    });
  }

}