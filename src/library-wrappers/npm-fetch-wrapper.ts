import * as npmFetch from "npm-registry-fetch";
import { NpmRegistrySearchResponse } from "../types/custom";
import * as xrayDecorator from "./xray-decorator";

export async function search(
  text: string,
  size: number
): Promise<NpmRegistrySearchResponse> {
  const path = `/-/v1/search?text=${encodeURIComponent(text)}&size=${size}`;
  return await fetch(path);
}

function fetch(
  path: string,
  traceName: string = "npm registry request"
): Promise<any> {
  return new Promise((resolve, reject) => {
    xrayDecorator.captureAsyncFunc(traceName, (subsegment: any) => {
      npmFetch
        .json(path)
        .then((response: any) => {
          subsegment.close();
          resolve(response);
        })
        .catch((err: any) => {
          subsegment.close(err);
          reject(err);
        });
    });
  });
}
