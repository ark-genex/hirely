import {BaseConfig, IConfig} from './interfaces/IConfig';

export class Config extends BaseConfig {

  private static instance : Config = undefined;

  static getInstance() : Config {
    if (!this.instance) this.instance = new Config();
    return this.instance;
  }

  constructor(){
    super();
    this.applyConfig();
  }

  private applyConfig(){
    switch (process.env.NODE_ENV) {
      case 'production':
        this.application.name = 'HIRELY';
        this.oauth.clientID = 'HIRELY';
        this.oauth.clientSecret = 'application data is my life';
        this.oauth.url = 'https://sso.hirely.com/oauth2.0';
        this.oauth.nodeBaseURL = 'https://hirely.com';
        this.oauth.autoLogoutOnSessionExpired = true;
        this.server.port = 3005;
        this.server.rootContext = '/ui';
        this.server.logPath = '/applogs/hirely';
        this.urls.hirely = 'https://hirely.com';
        this.urls.sso = 'https://sso.hirely.com';
        this.ga.id = '';
        this.dynatrace.enabled = false;
        this.clientLogger.flushInterval = 600000;
        this.clientLogger.maxLogLength = 10000;
        this.clientLogger.isDebugEnabled = true;
        this.clientLogger.enableLogService = true;
        this.googlemaps.enabled = true;
        this.googlemaps.clientId = '';
        this.googlemaps.url = 'https://maps.googleapis.com/maps';
        this.googlemaps.scriptEndpoint = 'https://maps.googleapis.com/maps/api/js';
        break;
      case 'sbx':
        this.application.name = 'HIRELY';
        this.oauth.clientID = 'HIRELY SBX';
        this.oauth.clientSecret = 'application data is my life';
        this.oauth.url = 'https://ssoqas.hirely.com/oauth2.0';
        this.oauth.nodeBaseURL = 'https://snd.hirely.com';
        this.oauth.autoLogoutOnSessionExpired = true;
        this.server.port = 3007;
        this.server.rootContext = '/ui';
        this.server.logPath = '/applogs/hirely/sbx';
        this.urls.hirely = 'https://snd.hirely.com';
        this.urls.sso = 'https://ssoqas.hirely.com';
        this.ga.id = '';
        this.dynatrace.enabled = false;
        this.clientLogger.flushInterval = 600000;
        this.clientLogger.maxLogLength = 10000;
        this.clientLogger.isDebugEnabled = true;
        this.clientLogger.enableLogService = true;
        this.googlemaps.enabled = true;
        this.googlemaps.clientId = '';
        this.googlemaps.url = 'https://maps.googleapis.com/maps';
        this.googlemaps.scriptEndpoint = 'https://maps.googleapis.com/maps/api/js';
        break;
      case 'qas':
        this.application.name = 'HIRELY';
        this.oauth.clientID = 'HIRELY QAS';
        this.oauth.clientSecret = 'application data is my life';
        this.oauth.url = 'https://ssoqas.hirely.com/oauth2.0';
        this.oauth.nodeBaseURL = 'https://qas.hirely.com';
        this.oauth.autoLogoutOnSessionExpired = true;
        this.server.port = 3008;
        this.server.rootContext = '/ui';
        this.server.logPath = '/applogs/hirely/qas';
        this.urls.hirely = 'https://qas.hirely.com';
        this.urls.sso = 'https://ssoqas.hirely.com';
        this.ga.id = '';
        this.dynatrace.enabled = false;
        this.clientLogger.flushInterval = 600000;
        this.clientLogger.maxLogLength = 10000;
        this.clientLogger.isDebugEnabled = true;
        this.clientLogger.enableLogService = true;
        this.googlemaps.enabled = true;
        this.googlemaps.clientId = '';
        this.googlemaps.url = 'https://maps.googleapis.com/maps';
        this.googlemaps.scriptEndpoint = 'https://maps.googleapis.com/maps/api/js';
        break;
      case 'development':
        this.application.name = 'HIRELY';
        this.oauth.clientID = 'HIRELY DEV';
        this.oauth.clientSecret = 'application data is my life';
        this.oauth.url = 'https://ssodev.hirely.com/oauth2.0';
        this.oauth.nodeBaseURL = 'https://dev.hirely.com';
        this.oauth.autoLogoutOnSessionExpired = true;
        this.server.port = 5004;
        this.server.rootContext = '/ui';
        this.server.logPath = '/applogs/hirely/dev';
        this.urls.hirely = 'https://dev.hirely.com';
        this.urls.sso = 'https://ssodev.hirely.com';
        this.ga.id = '';
        this.dynatrace.enabled = false;
        this.clientLogger.flushInterval = 600000;
        this.clientLogger.maxLogLength = 10000;
        this.clientLogger.isDebugEnabled = true;
        this.clientLogger.enableLogService = true;
        this.googlemaps.enabled = true;
        this.googlemaps.clientId = '';
        this.googlemaps.url = 'https://maps.googleapis.com/maps';
        this.googlemaps.scriptEndpoint = 'https://maps.googleapis.com/maps/api/js';
        break;
      default:
        this.application.name = 'HIRELY';
        this.oauth.clientID = 'HIRELY LOCAL';
        this.oauth.clientSecret = 'application data is my life';
        this.oauth.url = 'https://ssodev.hirely.com/oauth2.0';
        this.oauth.nodeBaseURL = 'http://localhost:3005';
        this.oauth.autoLogoutOnSessionExpired = true;
        this.server.port = 3005;
        this.server.rootContext = '/ui';
        this.server.logPath = __dirname + '/logs';
        this.urls.hirely = 'https://dev.hirely.com';
        this.urls.sso = 'https://ssodev.hirely.com';
        this.ga.id = '';
        this.dynatrace.enabled = false;
        this.clientLogger.flushInterval = 600000;
        this.clientLogger.maxLogLength = 10000;
        this.clientLogger.isDebugEnabled = true;
        this.clientLogger.enableLogService = true;
        this.googlemaps.enabled = true;
        this.googlemaps.clientId = '';
        this.googlemaps.url = 'https://maps.googleapis.com/maps';
        this.googlemaps.scriptEndpoint = 'https://maps.googleapis.com/maps/api/js';
    }
  }
}