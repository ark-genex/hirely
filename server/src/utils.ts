export class Utils {

  /*
  *
  * Escape Special Characters in JSON
  *
  * */
  public static escapeSpecialChars(jsonString) {

    return JSON.stringify(jsonString).replace(/\\n/g, "\\n")
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "\\t")
    .replace(/\\b/g, "\\b")
    .replace(/\\f/g, "\\f");

  }
}