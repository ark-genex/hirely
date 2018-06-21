import * as express from 'express';
import * as oauth2lib from 'simple-oauth2';
import {Config} from './config';

export class Security {

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
  }

  public static getOAuth2(app: express.Application, config: Config): any {
    // Set the configuration settings
    const credentials = {
      client: {
        id: config.oauth.clientID,
        secret: config.oauth.clientSecret,
        secretParamName: 'client_secret', // default
        idParamName: 'client_id'
      },
      auth: {
        tokenHost: config.oauth.url,
        tokenPath: '/oauth/token', // default
        revokePath: '/oauth/revoke', // default
        authorizeHost: config.oauth.url, // default
        authorizePath: '/oauth/authorize' // default
      }
    };

    return oauth2lib.create(credentials);
  }
}
