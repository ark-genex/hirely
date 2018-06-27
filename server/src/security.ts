import * as express from 'express';
import * as oauth2lib from 'simple-oauth2';
import {Config} from './config';
import {UrlSpace} from './url-space';
import {Logger} from 'log4js';

export class Security {

  private readonly config: Config = Config.getInstance();

  public logger: Logger;

  /*private clientId: string;
  private clientSecret: string;
  private tokenHost: string;
  private revalidateAfterMin: number;
  private longestTimeToLiveHours: number;

  private nodeBaseURL: string;
  private authCallbackURL: string;
  private reauthCallbackURL: string;
  private reauthCallbackTokenURL: string;

  private clientTimeout: number;
  private currentToken: string;
  private logoutUrl: string;
  private autoLogoutOnSessionExpired: string;*/

  constructor() {
    /*this.clientId = "%CLIENT_ID%";
    this.clientSecret = "%CLIENT_SECRET%";
    this.tokenHost = "%TOKEN_HOST%";
    this.reauthCallbackURL = "%REAUTH_CALLBACK_URL%";
    this.longestTimeToLiveHours = "%LONGEST_TIME_TO_LIVE_HOURS%";

    this.nodeBaseURL = "%NODE_BASE_URL%";
    this.authCallbackURL = "%AUTH_CALLBACK_URL%";
    this.reauthCallbackURL = "%REAUTH_CALLBACK_URL%";
    this.reauthCallbackTokenURL = "%REAUTH_CALLBACK_TOKEN_URL%";

    this.clientTimeout = (parseInt("%TIMEOUT_MINUTES%", 10) || 30) * 60 * 1000;
    this.currentToken = "%TOKEN%";
    this.logoutUrl = "%LOGOUT_URL%";
    this.autoLogoutOnSessionExpired = "%AUTO_LOGOUT_ON_SESSION_EXPIRED%";*/

    this.config.oauth.authCallbackURL = this.config.oauth.reauthCallbackURL || this.config.server.rootContext.concat(UrlSpace.AUTH_CALLBACK_URL);
    this.config.oauth.reauthCallbackURL = this.config.oauth.reauthCallbackURL || this.config.server.rootContext.concat(UrlSpace.REAUTH_CALLBACK_URL);
    this.config.oauth.reauthCallbackTokenURL = this.config.oauth.reauthCallbackTokenURL || this.config.server.rootContext.concat(UrlSpace.REAUTH_CALLBACK_TOKEN_URL);

    this.config.oauth.routes = this.config.oauth.routes || {};
    this.config.oauth.routes.auth = this.config.oauth.routes.auth || this.config.server.rootContext.concat(UrlSpace.AUTH);
    this.config.oauth.routes.reauth = this.config.oauth.routes.reauth || this.config.server.rootContext.concat(UrlSpace.REAUTH);
    this.config.oauth.routes.checkToken = this.config.oauth.routes.checkToken || this.config.server.rootContext.concat(UrlSpace.CHECK_TOKEN);
    this.config.oauth.routes.logoutToken = this.config.oauth.routes.logoutToken || this.config.server.rootContext.concat(UrlSpace.LOGOUT_TOKEN);

  }

  public getOAuth2(app: express.Application): any {
    // Set the configuration settings
    const credentials = {
      client: {
        id: this.config.oauth.clientID,
        secret: this.config.oauth.clientSecret,
        secretParamName: 'client_secret', // default
        idParamName: 'client_id'
      },
      auth: {
        tokenHost: this.config.oauth.url,
        tokenPath: '/oauth/token', // default
        revokePath: '/oauth/revoke', // default
        authorizeHost: this.config.oauth.url, // default
        authorizePath: '/oauth/authorize' // default
      }
    };

    return oauth2lib.create(credentials);
  }

  //ensure that all requests to static resources are authenticated
  public ensureAuthenticated(req, res, next): void {
    //check to see if the request has already been authenticated
    if ((req.url.indexOf('/selfservice/') === -1) &&
      (req.url === this.config.server.rootContext || req.url === this.config.server.rootContext + '/' || req.url.indexOf('/api/') !== -1)) {

      this.logger.debug('A request has been made to a protected resource, checking to see if authentication has already taken place');
      this.logger.debug('Request URL: ' + req.url);

      const token = this.getTokenFromHeader(req) || req.session.token;
      if (!token) {
        this.logger.debug('Authentication has not yet taken place, beginning authentication process');
        res.redirect(this.config.oauth.routes.auth);
      } else {
        this.logger.debug('Authentication has already taken place, returning requested resource');
        next();
      }

    } else {
      next();
    }
  }

  // checks the request header for 'authorization'
  private getTokenFromHeader(req): any {
    const authHeader = req.headers["authorization"];

    if (authHeader && authHeader.length > 7 && authHeader.substr(0,6) === "Bearer") {
      return authHeader.substr(7, authHeader.length - 7);
    }
    return undefined;
  }
}
