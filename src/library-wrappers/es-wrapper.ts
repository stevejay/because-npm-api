import { GotBodyOptions, GotJSONOptions } from "got";
import { GotNDJSONRequest, GotRequest } from "../types/custom";
import got from "./got-wrapper";

export async function get(request: GotRequest) {
  const params: GotJSONOptions = {
    method: "GET",
    json: true,
    headers: getAuthHeaders()
  };
  return await got(request.uri, params);
}

export async function post(request: GotRequest) {
  const params: GotJSONOptions = {
    method: "POST",
    json: true,
    body: request.body,
    headers: getAuthHeaders()
  };
  return await got(request.uri, params);
}

export async function postNDJSON(request: GotNDJSONRequest) {
  const params: GotBodyOptions<string> = {
    method: "POST",
    body: `${request.jsonList.map(json => JSON.stringify(json)).join("\n")}\n`,
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/x-ndjson"
    }
  };
  // Note: had to case params as any here as typing for got()
  // seems to incorrectly only accept GotJSONOptions instance.
  return await got(request.uri, params as any);
}

function getAuthHeaders() {
  return {
    Authorization: `Basic ${process.env.ELASTICSEARCH_BASIC_AUTH_VALUE}`
  };
}
