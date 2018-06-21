import { createServer, Server } from 'http';
import * as fs from 'fs';
import * as express from 'express';
import * as session from 'express-session';
import * as socketIo from 'socket.io';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as log4js from 'log4js';
// import * as logger from 'morgan';
import errorHandler = require('errorhandler');
// import methodOverride = require('method-override');
import {Logger} from 'log4js';
// import { Message } from './model';
import { Utils } from "./utils";
import { Security } from "./security";
import { Config } from "./config";


import { AppRouter } from "./routes/AppRouter";
import { IndexRouter } from "./routes/IndexRouter";
import { OAuth2Router } from "./routes/OAuth2Router";

export class HirelyServer {
  static readonly PORT: number = 3005;
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;
  private logger: Logger;
  private clientLogger: Logger;
  private httpLogger: Logger;
  private oAuth2: any;
  private config: Config;

  static bootstrap(): express.Application {
    const hirelyServer = new HirelyServer();
    return hirelyServer.getApp();
  }

  constructor() {
    this.createApp();
    this.configureLogs();
    this.appConfig();
    this.appSecurity();
    this.createServer();
    this.sockets();
    this.listen();
    this.routes();
  }

  private createApp(): void {
    this.app = express();
  }

  private configureLogs(): void {
    // make a log directory, just in case it isn't there. This is only needed for local environments.
    if (!process.env.NODE_ENV) {
      try {
        let logsPath = path.join(__dirname, '../dist/logs');
        if (!fs.existsSync(logsPath)) {
          fs.mkdirSync(logsPath); // TODO: This should be configurable for higher environments. Those entries should be in the config file
        }
      } catch (e) {
        if (e.code !== 'EEXIST') {
          console.error("Could not set up log directory, error was: ", e);
          process.exit(1);
        }
      }
    }

    log4js.configure(path.join(__dirname, '/log4js-config.json'));
    this.logger = log4js.getLogger('appLog');
    this.clientLogger = log4js.getLogger('clientLog');
    this.httpLogger = log4js.getLogger('http');
    this.logger.info('Logger has been set up. Now starting NodeJS Server for ADAMS');
  }

  private appConfig(): void {
    this.port = process.env.PORT || HirelyServer.PORT;
    this.config = new Config();

    // add static paths -
    // this.app.use(express.static(path.join(__dirname, "public")));

    //configure pug - Not using pug files for now.
    // this.app.set("views", path.join(__dirname, "views"));
    // this.app.set("view engine", "pug");

    // mount logger
    // this.app.use(logger("dev"));

    this.app.use(log4js.connectLogger(this.httpLogger, { level: 'auto' }));

    //mount json form parser
    this.app.use(bodyParser.json({limit: '50mb'}));

    //mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true, limit: '50mb', parameterLimit:50000
    }));

    // this.app.use(bodyParser.json()); -- This may not be needed again

    // mount cookie parser middleware
    this.app.use(cookieParser("HIRELY_COOKIES"));

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });


    // setup session
    this.app.use(session({
      resave: false,
      secret: "hirely session secret",
      saveUninitialized: false,
      unset: 'destroy'
    }));

    //error handling
    this.app.use(errorHandler());
  }

  private appSecurity(): void {
    this.oAuth2 = Security.getOAuth2(this.app, this.config);
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  /*
  *
  * Socket Communication.
  *
  * Create Socket Server
  *
  * */
  private sockets(): void {
    this.io = socketIo(this.server);
  }

  /*
  *
  * Listen to Socket Server
  *
  * */
  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Hirely Node Server running on port %s', this.port);
    });

    this.io.on('connect', (socket: any) => {
      console.log('Hirely Socket connected client on port %s.', this.port);
      /*socket.on('message', (m: Message) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });*/
    });
  }



  /*
  * Initialize Routes
  *
  * */
  private routes(): void {
    this.logger.info('initializing routers');

    const router = HirelyServer.getRouter();

    // Create Routes
    AppRouter.create(router, this.config);
    OAuth2Router.create(router, this.config, this.oAuth2);
    IndexRouter.create(router);

    //use router middleware
    this.app.use(router);
  }

  /*
  *
  * Get router
  * */
  static getRouter(): express.Router {
    return express.Router();
  }

  /*
  *
  * Return Express Application
  *
  * */
  private getApp(): express.Application {
    return this.app;
  }
}

  /* THE DRIVER*/

// new HirelyServer().getApp();
HirelyServer.bootstrap();
