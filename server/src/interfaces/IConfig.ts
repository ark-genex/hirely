export interface IApplication {
  name: string;
}

export interface IOAuth {
  clientID: string;
  clientSecret: string;
  url: string;
  nodeBaseURL: string;
  autoLogoutOnSessionExpired: boolean;
  [key: string]: any;
}

export interface IServer {
  port: number;
  rootContext: string;
  logPath: string;
}

export interface IUrls {
  hirely: string;
  sso: string;
}

export interface IGoogleAnalytics {
  id: string;
}

export interface IDynatrace {
  enabled: boolean;
}

export interface IClientLogger {
  flushInterval: number;
  maxLogLength: number;
  isDebugEnabled: boolean;
  enableLogService: boolean;
}

export interface IGooglemaps {
  enabled: boolean;
  clientId: string;
  url: string;
  scriptEndpoint: string;
}

export interface IConfig {
  application: IApplication;
  oauth: IOAuth;
  server: IServer;
  urls: IUrls;
  ga: IGoogleAnalytics;
  dynatrace: IDynatrace;
  clientLogger: IClientLogger;
  googlemaps: IGooglemaps;
}


/* CLASSES */
export class Application implements IApplication {
  name: string;

  constructor() {}
}

export class OAuth implements IOAuth {
  clientID: string;
  clientSecret: string;
  url: string;
  nodeBaseURL: string;
  autoLogoutOnSessionExpired: boolean;
  [x: string]: any;

  constructor() {}
}

export class Server implements IServer {
  port: number;
  rootContext: string;
  logPath: string;

  constructor(){}
}

export class Urls implements IUrls {
  hirely: string;
  sso: string;

  constructor(){}
}

export class GoogleAnalytics implements IGoogleAnalytics {
  id: string;

  constructor(){}
}

export class Dynatrace implements IDynatrace {
  enabled: boolean;

  constructor(){}
}

export class ClientLogger implements IClientLogger {
  flushInterval: number;
  maxLogLength: number;
  isDebugEnabled: boolean;
  enableLogService: boolean;

  constructor(){}
}

export class Googlemaps implements IGooglemaps {
  enabled: boolean;
  clientId: string;
  url: string;
  scriptEndpoint: string;

  constructor(){}
}

export class BaseConfig implements IConfig {
  application: IApplication;
  oauth: IOAuth;
  server: IServer;
  urls: IUrls;
  ga: IGoogleAnalytics;
  dynatrace: IDynatrace;
  clientLogger: IClientLogger;
  googlemaps: IGooglemaps;

  constructor() {
    this.application = new Application();
    this.oauth = new OAuth();
    this.server = new Server();
    this.urls = new Urls();
    this.ga = new GoogleAnalytics();
    this.dynatrace = new Dynatrace();
    this.clientLogger = new ClientLogger();
    this.googlemaps = new Googlemaps();
  }
}