export interface IApplication {
  name: string;
}

export interface IOAuth {
  clientID: string;
  clientSecret: string;
  url: string;
  nodeBaseURL: string;
  autoLogoutOnSessionExpired: boolean;
  [x: string]: any;
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
