// tslint:disable:ordered-imports
// Note: I had to disable the rule for this whole file to allow
// the xray setup import to be first.
import "./xray-setup";
import log from "loglevel";
import * as twitterService from "../twitter-service";
import { WarmUpAPIGatewayEvent } from "../types/custom";
import * as mapper from "./mapper";

log.setLevel(log.levels.WARN);
const WARMUP_PLUGIN_SOURCE = "serverless-plugin-warmup";

export async function handler(event: WarmUpAPIGatewayEvent) {
  if (event.source === WARMUP_PLUGIN_SOURCE) {
    log.info(WARMUP_PLUGIN_SOURCE);
    return WARMUP_PLUGIN_SOURCE;
  }
  const request = mapper.mapTwitterWebhookRequest(event);
  return twitterService.handleTwitterWebhookRequest(request);
}
