import * as express from 'express';
import * as oauth2lib from 'simple-oauth2';
import { Config } from "./config";

export class Security {

  private clientId: string;
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
  private autoLogoutOnSessionExpired: string;
  private credentials: any;

  constructor() {
    this.clientId = "%CLIENT_ID%";
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
    this.autoLogoutOnSessionExpired = "%AUTO_LOGOUT_ON_SESSION_EXPIRED%";
  }

  public static create(app: express.Application, config: Config): void {
    // Set the configuration settings
    this.credentials = {
      client: {
        id: '<client-id>',
        secret: '<client-secret>'
      },
      auth: {
        tokenHost: 'https://api.oauth.com'
      }
    };

    const oauth2 = oauth2lib.create(credentials);

    // #Authorization Code flow
    (() => {
      // Authorization oauth2 URI
      const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: 'http://localhost:3000/callback',
        scope: '<scope>',
        state: '<state>'
      });

      // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
      // res.redirect(authorizationUri);
      // Get the access token object (the authorization code is given from the previous step).
      const tokenConfig = {
        code: '<code>',
        redirect_uri: 'http://localhost:3000/callback',
        scope: ['<scope1>', '<scope2>']
      };

      // Callbacks
      // Save the access token
      /*oauth2.authorizationCode.getToken(tokenConfig, (error, result) => {
        if (error) {
          console.log('Access Token Error', error.message);
          return;
        }

        const token = oauth2.accessToken.create(result);
      });*/

      // Promises
      // Save the access token
      oauth2.authorizationCode.getToken(tokenConfig)
      .then((result) => {
        const token = oauth2.accessToken.create(result);
      })
      .catch((error) => {
        console.log('Access Token Error', error.message);
      });
    })();

// #Client Credentials Flow
    (() => {
      const tokenConfig = {};

      // Callbacks
      // Get the access token object for the client
      oauth2.clientCredentials.getToken(tokenConfig, (error, result) => {
        if (error) {
          console.log('Access Token Error', error.message);
          return;
        }

        const token = oauth2.accessToken.create(result);
      });

      // Promises
      // Get the access token object for the client
      oauth2.clientCredentials.getToken(tokenConfig)
      .then((result) => {
        const token = oauth2.accessToken.create(result);
      })
      .catch((error) => {
        console.log('Access Token error', error.message);
      });
    })();

// #Access Token object
    (() => {
      // Sample of a JSON access token (you got it through previous steps)
      const tokenObject = {
        access_token: '<access-token>',
        refresh_token: '<refresh-token>',
        expires_in: '7200'
      };

      // Create the access token wrapper
      let token = oauth2.accessToken.create(tokenObject);

      // Check if the token is expired. If expired it is refreshed.
      if (token.expired()) {
        // Callbacks
        token.refresh((error, result) => {
          token = result;
        });

        // Promises
        token.refresh().then((result) => {
          token = result;
        });
      }

      // Callbacks
      // Revoke only the access token
      token.revoke('access_token', (error) => {
        // Session ended. But the refresh_token is still valid.
        // Revoke the refresh_token
        token.revoke('refresh_token', (error) => {
          console.log('token revoked.');
        });
      });

      // Promises
      // Revoke only the access token
      token.revoke('access_token')
      .then(() => {
        // Revoke the refresh token
        return token.revoke('refresh_token');
      })
      .then(() => {
        console.log('Token revoked');
      })
      .catch((error) => {
        console.log('Error revoking token.', error.message);
      });
    })();
  }
}