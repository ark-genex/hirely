import {Router} from 'express';
import {AbstractBaseRoute} from './BaseRoute';
import {Config} from './../config';
import {UrlSpace} from './../url-space';

/**
 * / route
 *
 * @class OAuth2Router
 */
export class OAuth2Router extends AbstractBaseRoute {

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

    // '/ui/logout'
    oAuth2Router.get(config.server.rootContext + UrlSpace.LOGOUT, function (req, res) {
      // res.redirect(config.urls.sso + '/closeBrowser.jsp');
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

        // Promises
        // Get the access token object for the client
        oAuth2.clientCredentials.getToken(tokenConfig)
          .then((error, result) => {
            const token = oAuth2.accessToken.create(result);

            // save token
            this.addTokenToDB(error, result, req, res)
              .then(function (success: any) {
                this.logger.debug('Successfully completed OAuth authentication process', success);
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
  }

  /* PRIVATE FUNCTIONS */

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
