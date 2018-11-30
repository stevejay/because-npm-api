import _ from "lodash";

export function parse(cursor: string): any {
  if (_.isEmpty(cursor)) {
    return null;
  }
  // TODO needs to be replaced with '= Buffer.from(cursor,...'
  // when AWS Lambda supports Node v10:
  const str = new Buffer(cursor, "base64").toString("ascii");
  return JSON.parse(str);
}

export function create(sortArray: any): string {
  if (_.isEmpty(sortArray)) {
    return "";
  }
  const str = JSON.stringify(sortArray);
  // TODO needs to be replaced with '= Buffer.from(cursor,...'
  // when AWS Lambda supports Node v10:
  return new Buffer(str).toString("base64");
}
