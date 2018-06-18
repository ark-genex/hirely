import * as express from 'express';

export class Security {

  private clientTimeout;
  private currentToken;
  private logoutUrl;
  private autoLogoutOnSessionExpired;

  constructor(){
    this.clientTimeout = (parseInt("%TIMEOUT_MINUTES%", 10) || 30) * 60 * 1000;
    this.currentToken = "%TOKEN%";
    this.logoutUrl = "%LOGOUT_URL%";
    this.autoLogoutOnSessionExpired = "%AUTO_LOGOUT_ON_SESSION_EXPIRED%";
  }

  public static create(app: express.Application): void {
  }
}