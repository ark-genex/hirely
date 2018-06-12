export class UrlSpace {

  /* LOCAL URLS */

  static readonly LOCAL_USER = '/api/user';
  static readonly LOCAL_USER_HISTORY = '/api/users/:username/history';

  /* HIRELY API URLS */

  static readonly HIRELY_USER = '/api/users?limit={limit}&page={page}&sorts={sorts}&search={search}';
  static readonly HIRELY_USER_HISTORY = '/api/users/{userName}/history?limit={limit}&page={page}&sorts={sorts}&fields={fields}&search={search}';

  /* HEADERS */

  static readonly HEADERS_HIRELY_ACCEPT_V1 = 'application/vnd.hirely-v1.0+json';
  static readonly HEADERS_HIRELY_ACCEPT_V2 = 'application/vnd.hirely-v2.0+json';

  static readonly HEADERS_CONTENT_TYPE_NAME = 'Content-Type';
  static readonly HEADERS_CONTENT_TYPE_JSON = 'application/json';
  static readonly HEADERS_CONTENT_TYPE_HTML = 'text/html';

}
