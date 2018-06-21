import {NextFunction, Request, Response, Router} from 'express';
import {AbstractBaseRoute} from './BaseRoute';
import {Config} from './../config';

/**
 * / route
 *
 * @class AppRouter
 */
export class AppRouter extends AbstractBaseRoute {

  /**
   * Constructor
   *
   * @class AppRouter
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Create the routes.
   *
   * @class AppRouter
   * @method create
   * @static
   */
  public static create(appRouter: Router, config: Config) {

    if ('/' !== config.server.rootContext) {
      appRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
        if (req.session) {
          // req.session.destroy();
        }
        res.redirect(config.server.rootContext);
      });
    }

    appRouter.get(config.server.rootContext + '/', function (req, res) {
      if (req.session) {
        // req.session.destroy();
      }
      res.redirect(config.server.rootContext + '/auth');
    });
  }
}
