import {
  IClientLogger,
  IGooglemaps,
  IApplication,
  IConfig,
  IDynatrace,
  IGoogleAnalytics,
  IOAuth,
  IServer,
  IUrls
} from './interfaces/IConfig';

export class Config implements IConfig {

  config: IConfig;
  application: IApplication;
  oauth: IOAuth;
  server: IServer;
  urls: IUrls;
  ga: IGoogleAnalytics;
  dynatrace: IDynatrace;
  clientLogger: IClientLogger;
  googlemaps: IGooglemaps;

  constructor() {
    this.getConfig();
  }

  private getConfig() {
    switch (process.env.NODE_ENV) {
      case 'production':
        this.config.application.name = 'HIRELY';
        this.config.oauth.clientID = 'HIRELY';
        this.config.oauth.clientSecret = 'application data is my life';
        this.config.oauth.url = 'https://sso.hirely.com/oauth2.0';
        this.config.oauth.nodeBaseURL = 'https://hirely.com';
        this.config.oauth.autoLogoutOnSessionExpired = true;
        this.config.server.port = 3005;
        this.config.server.rootContext = '/ui';
        this.config.server.logPath = '/applogs/hirely';
        this.config.urls.hirely = 'https://hirely.com';
        this.config.urls.sso = 'https://sso.hirely.com';
        this.config.ga.id = '';
        this.config.dynatrace.enabled = false;
        this.config.clientLogger.flushInterval = 600000;
        this.config.clientLogger.maxLogLength = 10000;
        this.config.clientLogger.isDebugEnabled = true;
        this.config.clientLogger.enableLogService = true;
        this.config.googlemaps.enabled = true;
        this.config.googlemaps.clientId = '';
        this.config.googlemaps.url = 'https://maps.googleapis.com/maps';
        this.config.googlemaps.scriptEndpoint = 'https://maps.googleapis.com/maps/api/js';
        break;
      case 'sbx':
        this.config.application.name = 'HIRELY';
        this.config.oauth.clientID = 'HIRELY SBX';
        this.config.oauth.clientSecret = 'application data is my life';
        this.config.oauth.url = 'https://ssoqas.hirely.com/oauth2.0';
        this.config.oauth.nodeBaseURL = 'https://snd.hirely.com';
        this.config.oauth.autoLogoutOnSessionExpired = true;
        this.config.server.port = 3007;
        this.config.server.rootContext = '/ui';
        this.config.server.logPath = '/applogs/hirely/sbx';
        this.config.urls.hirely = 'https://snd.hirely.com';
        this.config.urls.sso = 'https://ssoqas.hirely.com';
        this.config.ga.id = '';
        this.config.dynatrace.enabled = false;
        this.config.clientLogger.flushInterval = 600000;
        this.config.clientLogger.maxLogLength = 10000;
        this.config.clientLogger.isDebugEnabled = true;
        this.config.clientLogger.enableLogService = true;
        this.config.googlemaps.enabled = true;
        this.config.googlemaps.clientId = '';
        this.config.googlemaps.url = 'https://maps.googleapis.com/maps';
        this.config.googlemaps.scriptEndpoint = 'https://maps.googleapis.com/maps/api/js';
        break;
      case 'qas':
        this.config.application.name = 'HIRELY';
        this.config.oauth.clientID = 'HIRELY QAS';
        this.config.oauth.clientSecret = 'application data is my life';
        this.config.oauth.url = 'https://ssoqas.hirely.com/oauth2.0';
        this.config.oauth.nodeBaseURL = 'https://qas.hirely.com';
        this.config.oauth.autoLogoutOnSessionExpired = true;
        this.config.server.port = 3008;
        this.config.server.rootContext = '/ui';
        this.config.server.logPath = '/applogs/hirely/qas';
        this.config.urls.hirely = 'https://qas.hirely.com';
        this.config.urls.sso = 'https://ssoqas.hirely.com';
        this.config.ga.id = '';
        this.config.dynatrace.enabled = false;
        this.config.clientLogger.flushInterval = 600000;
        this.config.clientLogger.maxLogLength = 10000;
        this.config.clientLogger.isDebugEnabled = true;
        this.config.clientLogger.enableLogService = true;
        this.config.googlemaps.enabled = true;
        this.config.googlemaps.clientId = '';
        this.config.googlemaps.url = 'https://maps.googleapis.com/maps';
        this.config.googlemaps.scriptEndpoint = 'https://maps.googleapis.com/maps/api/js';
        break;
      case 'development':
        this.config.application.name = 'HIRELY';
        this.config.oauth.clientID = 'HIRELY DEV';
        this.config.oauth.clientSecret = 'application data is my life';
        this.config.oauth.url = 'https://ssodev.hirely.com/oauth2.0';
        this.config.oauth.nodeBaseURL = 'https://dev.hirely.com';
        this.config.oauth.autoLogoutOnSessionExpired = true;
        this.config.server.port = 5004;
        this.config.server.rootContext = '/ui';
        this.config.server.logPath = '/applogs/hirely/dev';
        this.config.urls.hirely = 'https://dev.hirely.com';
        this.config.urls.sso = 'https://ssodev.hirely.com';
        this.config.ga.id = '';
        this.config.dynatrace.enabled = false;
        this.config.clientLogger.flushInterval = 600000;
        this.config.clientLogger.maxLogLength = 10000;
        this.config.clientLogger.isDebugEnabled = true;
        this.config.clientLogger.enableLogService = true;
        this.config.googlemaps.enabled = true;
        this.config.googlemaps.clientId = '';
        this.config.googlemaps.url = 'https://maps.googleapis.com/maps';
        this.config.googlemaps.scriptEndpoint = 'https://maps.googleapis.com/maps/api/js';
        break;
      default:
        this.config.application.name = 'HIRELY';
        this.config.oauth.clientID = 'HIRELY LOCAL';
        this.config.oauth.clientSecret = 'application data is my life';
        this.config.oauth.url = 'https://ssodev.hirely.com/oauth2.0';
        this.config.oauth.nodeBaseURL = 'http://localhost:3005';
        this.config.oauth.autoLogoutOnSessionExpired = true;
        this.config.server.port = 3005;
        this.config.server.rootContext = '/ui';
        this.config.server.logPath = __dirname + '/logs';
        this.config.urls.hirely = 'https://dev.hirely.com';
        this.config.urls.sso = 'https://ssodev.hirely.com';
        this.config.ga.id = '';
        this.config.dynatrace.enabled = false;
        this.config.clientLogger.flushInterval = 600000;
        this.config.clientLogger.maxLogLength = 10000;
        this.config.clientLogger.isDebugEnabled = true;
        this.config.clientLogger.enableLogService = true;
        this.config.googlemaps.enabled = true;
        this.config.googlemaps.clientId = '';
        this.config.googlemaps.url = 'https://maps.googleapis.com/maps';
        this.config.googlemaps.scriptEndpoint = 'https://maps.googleapis.com/maps/api/js';
    }
  }
}
