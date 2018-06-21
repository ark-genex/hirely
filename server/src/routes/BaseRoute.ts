import {NextFunction, Request, Response} from 'express';
import * as log4js from 'log4js';
import {Logger} from 'log4js';

/**
 * Constructor
 *
 * @class AbstractBaseRoute
 */
export class AbstractBaseRoute {

  /*protected title: string;
  private scripts: string[];*/

  public logger: Logger;


  /**
   * Constructor
   *
   * @class AbstractBaseRoute
   * @constructor
   */
  constructor() {
    // initialize variables
    // this.title = "Hirely Base Router";
    // this.scripts = [];
    this.logger = log4js.getLogger('appLog');
  }

  /**
   * Add a JS external file to the request.
   *
   * @class AbstractBaseRoute
   * @method addScript
   * @param src {string} The src to the external JS file.
   * @return {AbstractBaseRoute} Self for chaining
   */
  public addScript(src: string): AbstractBaseRoute {
    // this.scripts.push(src);
    return this;
  }

  /**
   * Render a page.
   *
   * @class AbstractBaseRoute
   * @method render
   * @param req {Request} The request object.
   * @param res {Response} The response object.
   * @param view {String} The view to render.
   * @param options {Object} Additional options to append to the view's local scope.
   * @return void
   */
  public render(req: Request, res: Response, view: string, options?: Object) {
    /*//add constants
    res.locals.BASE_URL = "/";

    //add scripts
    res.locals.scripts = this.scripts;

    //add title
    res.locals.title = this.title;

    //render view
    res.render(view, options);


    // This is for demo purpose only.
    res.send(JSON.stringify("Success"));

    // TODO: Need to do authentication on '/'*/
  }
}
