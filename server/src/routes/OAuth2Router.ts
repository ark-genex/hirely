import {Router} from 'express';
import {AbstractBaseRoute} from './BaseRoute';
import {Config} from './../config';
import {UrlSpace} from './../url-space';
import {Promise} from 'es6-promise';

/**
 * / route
 *
 * @class OAuth2Router
 */
export class OAuth2Router extends AbstractBaseRoute {

  private config: Config = Config.getInstance();

  /**
   * Constructor
   *
   * @class OAuth2Router
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Create OAuth2 routes.
   *
   * @class OAuth2Router
   * @method create
   * @static
   */
  public static create(oAuth2Router: Router, config: Config, oAuth2: any) {

    // '/auth'
    oAuth2Router.get(UrlSpace.AUTH, function (req, res) {
      this.logger.debug('Beginning OAuth Authentication');

      this.checkBaseURL(req, config);

      const authorizationUri = oAuth2.authorizationCode.authorizeURL({
        redirect_uri: config.oauth.nodeBaseURL + config.oauth.authCallbackURL
      });

      this.logger.debug('Authorization URL: ' + authorizationUri);

      res.redirect(authorizationUri);
    });

    // '/auth/reauth'
    oAuth2Router.get(config.oauth.routes.reauth, function (req, res) {
      this.logger.debug('Beginning Reauthorization with OAuth');

      this.checkBaseURL(req, config);

      const reauthorizeUri = oAuth2.authCode.authorizeURL({redirect_uri: config.oauth.nodeBaseURL + config.oauth.reauthCallbackURL});
      this.logger.debug('Reauthorization URL: ' + reauthorizeUri);

      res.redirect(reauthorizeUri);
    });

    // Callback service parsing the authorization token and asking for the access token
    // '/callback'
    oAuth2Router.get(config.oauth.authCallbackURL, function (req, res) {
      this.logger.debug('Entering OAuth callback endpoint');

      const code = req.query.code;
      this.logger.debug('Retrieved the following OAuth code from the OAuth server ' + code);

      if (code) {
        this.checkBaseURL(req);

        // Get the access token object (the authorization code is given from the previous step).
        const tokenConfig = {
          code: code,
          redirect_uri: config.oauth.nodeBaseURL + config.oauth.authCallbackURL
        };

        // Get the access token object for the client
        oAuth2.clientCredentials.getToken(tokenConfig)
        .then((error, result) => {
          if (error) {
            this.logger.error('An error occurred while attempting to retrieve authentication');
            this.logger.error(error);
            res.status(500).send('An error occurred while attempting to retrieve authentication.');
            return;
          }

          const token = oAuth2.accessToken.create(result);
          console.log("Are tokens same? ", token === result.access_token);

          // save token
          this.addTokenToDB(error, result, req, res)
          .then(function (success: any) {
            this.logger.debug('Successfully completed OAuth authentication process');
            res.redirect(config.server.rootContext);
          }, function (err: any) {
            this.logger.debug('An error occurred during OAuth authentication process', err.message);
            res.redirect(config.server.rootContext);
          });
        })
        .catch((error) => {
          this.logger.error('An error occurred while attempting to retrieve authentication');
          this.logger.error(error);
          res.status(500).send('An error occurred while attempting to retrieve authentication.');
          return;
        });
      } else {
        this.logger.error('Call to OAuth Server did not return a code to use to get token');
        res.status(500).send('An error occurred during the authentication process. Please contact support.');
      }
    });

    // '/callback/reauth'
    oAuth2Router.get(config.oauth.reauthCallbackURL, function (req, res) {
      this.logger.debug('REAUTH - Entering OAuth ReAuth callback endpoint');

      const code = req.query.code;
      this.logger.debug('REAUTH - Retrieved the following OAuth code from the OAuth server ' + code);

      if (code) {

        // Get the access token object (the authorization code is given from the previous step).
        const tokenConfig = {
          code: code,
          redirect_uri: config.oauth.nodeBaseURL + config.oauth.reauthCallbackURL
        };

        // Get the access token object for the client
        oAuth2.clientCredentials.getToken(tokenConfig)
        .then((error, result) => {
          if (error) {
            this.logger.error('REAUTH - An error occurred while attempting to retrieve authentication');
            this.logger.error(error);
            res.status(500).send('REAUTH - An error occurred while attempting to retrieve authentication.');
            return;
          }

          const token = oAuth2.accessToken.create(result);
          console.log("Are tokens same? ", token === result.access_token);

          // save token
          this.addTokenToDB(error, result, req, res)
          .then(function (success: any) {
            this.logger.debug('REAUTH - Successfully complete OAuth reauthentication process');
            res.redirect(config.oauth.reauthCallbackTokenURL);
          }, function (err: any) {
            this.logger.debug('REAUTH - An error occurred during OAuth reauthentication process');
            res.redirect('/');
          });
        })
        .catch((error) => {
          this.logger.error('REAUTH - An error occurred while attempting to retrieve authentication');
          this.logger.error(error);
          res.status(500).send('REAUTH - An error occurred while attempting to retrieve authentication.');
          return;
        });

      } else {
        this.logger.error('REAUTH - Call to OAuth Server did not return a code to use to get token');
        res.status(500).send('REAUTH - An error occurred during the authentication process. Please contact support.');
      }
    });


    // '/callback/reauth/token'
    oAuth2Router.get(config.oauth.reauthCallbackTokenURL, function(req, res) {
      this.logger.debug('Entering Reauth token callback endpoint');
      if (req.session && req.session.hasOwnProperty("token")) {
        this.logger.debug('Token: ' + req.session.token);
        res.status(200).send('<html><body>' +
          '  <div id="newToken" style="display: none;">' + req.session.token + '</div>' +
          '  <div id="newProfile" style="display: none;">' + req.session.profile + '</div>' +
          '  <div>Authentication complete, re-directing back to application...</div>' +
          '</body></html>');
      } else {
        this.logger.error('No token was found in the session after oauth process was completed successfully, redirecting back to reauth endpoint to try again');
        res.redirect(config.oauth.routes.reauth);
      }
    });

    // '/auth/logout'
    oAuth2Router.get(config.oauth.routes.logoutToken, function(req, res) {
      this.logger.debug('processing logout');
      req.session.destroy(function (err) {
        if(err) {
          this.logger.error('failed logout.');
        }
        if(req.headers['authorization']) {
          delete req.headers['authorization'];
        }
        res.send(true);
      });
    });



    // '/ui/logout'
    oAuth2Router.get(config.server.rootContext + UrlSpace.LOGOUT, function (req, res) {
      // res.redirect(config.urls.sso + '/closeBrowser.jsp');
      this.logger.debug('Logging out');
    });

  }




  /* ------------------------------------   PRIVATE FUNCTIONS  ----------------------------------  */

  private checkBaseURL(req, config): void {
    if (!config.oauth.nodeBaseURL || config.oauth.nodeBaseURL.length === 0) {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      config.oauth.nodeBaseURL = protocol + '://' + req.get('host');
    }
  }

  private addTokenToDB(error, result, req, res): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (error) {
        this.logger.error('Access Token Error', error.message);
        // reject(false);
      }

      result = this.validateAndFormatTokenFromServer(result);

      if (result) {
        req.session.token = result.access_token;
        resolve(true);

        // TODO: Should we store the Token to DB? If So implement that here and send resolve(true) once done.
      } else {
        this.logger.error('Unable to determine access token for request');
        reject(false);
      }
    });
  }

  // validates and formats token received from oauth server (OMS)
  private validateAndFormatTokenFromServer(result): any {
    this.logger.debug('Executing validateAndFormatTokenFromServer for result ' + JSON.stringify(result));
    if (Object.prototype.toString.call(result) === '[object String]') {
      const objects = result.split('&');
      const newResult = {};
      for (let i = 0; i < objects.length; i++) {
        const tmpObj = objects[i].split('=');
        newResult[tmpObj[0]] = tmpObj[1];
      }
      result = newResult;
    }

    if (result && result.hasOwnProperty('access_token') && result.access_token.length > 5) {
      this.logger.debug('Validation complete, token ' + result.access_token + ' is good');
    } else {
      this.logger.error('Token did no pass validation ' + result.access_token);
      result = null;
    }

    return result;
  }

  private sendInvalidToken(res): void {
    res.status(401).send("invalid token");
  }

  private sendUnauthorized(res): void {
    res.status(401).send("unauthorized<br/><br/>\n<a href='/'>&lt; Back to home</a>");
  }





  // #Authorization Code flow
  /*(() => {
    // Authorization oAuth2 URI
    const authorizationUri = oAuth2.authorizationCode.authorizeURL({
      redirect_uri: 'http://localhost:3000/callback',
      scope: '<scope>',
      state: '<state>'
    });

    // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
    res.redirect(authorizationUri);

    // Get the access token object (the authorization code is given from the previous step).
    const tokenConfig = {
      code: '<code>',
      redirect_uri: 'http://localhost:3000/callback',
      scope: ['<scope1>', '<scope2>']
    };

    // Callbacks
    // Save the access token
    /!*oAuth2.authorizationCode.getToken(tokenConfig, (error, result) => {
      if (error) {
        console.log('Access Token Error', error.message);
        return;
      }

      const token = oAuth2.accessToken.create(result);
    });*!/

    // Promises
    // Save the access token
    oAuth2.authorizationCode.getToken(tokenConfig)
    .then((result) => {
      const token = oAuth2.accessToken.create(result);
    })
    .catch((error) => {
      console.log('Access Token Error', error.message);
    });
  })();*/

// #Client Credentials Flow
  /*(() => {
    const tokenConfig = {};

    // Callbacks
    // Get the access token object for the client
    /!*oAuth2.clientCredentials.getToken(tokenConfig, (error, result) => {
      if (error) {
        console.log('Access Token Error', error.message);
        return;
      }

      const token = oAuth2.accessToken.create(result);
    });*!/

    // Promises
    // Get the access token object for the client
    oAuth2.clientCredentials.getToken(tokenConfig)
    .then((result) => {
      const token = oAuth2.accessToken.create(result);
    })
    .catch((error) => {
      console.log('Access Token error', error.message);
    });
  })();*/

// #Access Token object
  /*(() => {
    // Sample of a JSON access token (you got it through previous steps)
    const tokenObject = {
      access_token: '<access-token>',
      refresh_token: '<refresh-token>',
      expires_in: '7200'
    };

    // Create the access token wrapper
    let token = oAuth2.accessToken.create(tokenObject);

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
    /!*token.revoke('access_token', (error) => {
      // Session ended. But the refresh_token is still valid.
      // Revoke the refresh_token
      token.revoke('refresh_token', (error) => {
        console.log('token revoked.');
      });
    });*!/

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
  })();*/
}
