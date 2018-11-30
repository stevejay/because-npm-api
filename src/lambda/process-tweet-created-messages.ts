// tslint:disable:ordered-imports
// Note: I had to disable the rule for this whole file to allow
// the xray setup import to be first.
import "./xray-setup";
import log from "loglevel";
import * as twitterService from "../twitter-service";
import * as mapper from "./mapper";

log.setLevel(log.levels.DEBUG);

export async function handler(event: AWSLambda.SQSEvent) {
  const request = mapper.mapTweetCreatedMessages(event);
  await Promise.all(
    request.messages.map(twitterService.processTweetCreatedMessage)
  );
  return { statusCode: 200 };
}
