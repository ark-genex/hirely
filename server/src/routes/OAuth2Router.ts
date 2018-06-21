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
  }

  /* PRIVATE FUNCTIONS */

  private checkBaseURL(req, config): void {
    if (!config.oauth.nodeBaseURL || config.oauth.nodeBaseURL.length === 0) {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      config.oauth.nodeBaseURL = protocol + '://' + req.get('host');
    }
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
