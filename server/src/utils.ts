import * as log4js from 'log4js';
import { Logger } from 'log4js';
import * as request from 'request';
import { Promise } from 'es6-promise';

export class Utils {
  private logger: Logger;

  constructor() {
    this.logger = log4js.getLogger('appLog');
  }

  /*
  *
  * Escape Special Characters in JSON
  *
  * */
  public static escapeSpecialChars(jsonString: string) {

    return JSON.stringify(jsonString).replace(/\\n/g, '\\n')
    .replace(/\\'/g, '\\\'')
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, '\\&')
    .replace(/\\r/g, '\\r')
    .replace(/\\t/g, '\\t')
    .replace(/\\b/g, '\\b')
    .replace(/\\f/g, '\\f');

  }

  public static makeApiCallWithOAuthToken(url: string,
                                          token: string,
                                          accept: any,
                                          method: any,
                                          body: any,
                                          contentType: any): Promise<any> {
    return new Promise((resolve, reject) => {

      let options;

      if (contentType) {
        options = {
          method: (method) ? method : 'GET',
          url: encodeURI(url),
          headers: {
            access_token: token,
            accept: accept,
            'content-type': contentType
          }
        };
      } else {
        options = {
          method: (method) ? method : 'GET',
          url: encodeURI(url),
          headers: {
            access_token: token,
            accept: accept
          }
        };
      }

      if (body) {
        options.body = body;
        options.json = true;
      }

      function callback(error, response, body) {

        let responseObject;
        try {
          responseObject = ('object' === typeof body) ? body : JSON.parse(body);
        } catch (e) {
          responseObject = {error: {http_status: response ? response.statusCode : 500 , user_message: response ? response.body : 'Unknown Error'}};
        }

        if (!error && response && response.statusCode.toString().startsWith(2)) {
          resolve(responseObject);
        } else {
          this.logger.error('An error occurred while attempting to make an API call to', url);
          this.logger.error('Request options: ', options);
          this.logger.error('Response object body: ', responseObject);

          reject((responseObject && responseObject.error) ? responseObject.error : 'An unknown error occurred');
        }
      }

      request(options, callback);
    });

  }
}
