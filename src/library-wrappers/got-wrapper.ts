import got from "got";
import * as xrayDecorator from "./xray-decorator";

export default function gotWrapper(
  url: got.GotUrl,
  options: got.GotJSONOptions,
  traceName: string = "http request"
): Promise<got.Response<any>> {
  return new Promise((resolve, reject) => {
    xrayDecorator.captureAsyncFunc(traceName, (subsegment: any) => {
      got(url, options)
        .then(response => {
          subsegment.close();
          resolve(response);
        })
        .catch(err => {
          subsegment.close(err);
          reject(err);
        });
    });
  });
}
