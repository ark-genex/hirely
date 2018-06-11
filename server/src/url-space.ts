/*export interface IURLS {
  local: ILocal;
  hirely: IHirely;
  headers: IHeaders;
}

export interface ILocal {
  user: string;
  userHistory: string;
}

export interface IHirely {
  user: string;
  userHistory: string;
}

export interface IHeaders {

}*/


export class UrlSpace /*implements IURLS*/ {
  /*headers: IHeaders;
  hirely: IHirely;
  local: ILocal;*/


  /* LOCAL URLS */
  private static readonly LOCAL_USER = '/api/user';
  private static readonly LOCAL_USER_HISTORY = '/api/users/:username/history';

  /* HIRELY API URLS */
  private static readonly HIRELY_USER = '/api/users?limit={limit}&page={page}&sorts={sorts}&search={search}';
  private static readonly HIRELY_USER_HISTORY = '/api/users/{userName}/history?limit={limit}&page={page}&sorts={sorts}&fields={fields}&search={search}';


}
