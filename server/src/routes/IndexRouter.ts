import { NextFunction, Request, Response, Router } from "express";
import { AbstractBaseRoute } from './BaseRoute';


/**
 * / route
 *
 * @class IndexRouter
 */
export class IndexRouter extends AbstractBaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRouter
   * @method create
   * @static
   */
  public static create(router: Router) {

    //add home page route
    router.get("/index", (req: Request, res: Response, next: NextFunction) => {
      new IndexRouter().index(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class IndexRouter
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The home page route.
   *
   * @class IndexRouter
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public index(req: Request, res: Response, next: NextFunction) {
   /* //set custom title
    this.title = "Home | Tour of Heros";

    //set message
    let options: Object = {
      "message": "Welcome to the Tour of Heros"
    };

    //render template
    this.render(req, res, "index", options);*/
  }
}