// tslint:disable:ordered-imports
// Note: I had to disable the rule for this whole file to allow
// the xray setup import to be first.
import "./xray-setup";
import log from "loglevel";
import * as twitterService from "../twitter-service";
import * as mapper from "./mapper";
import withErrorHandling from "./with-error-handling";

log.setLevel(log.levels.DEBUG);

export const handler = withErrorHandling(
  async (event: AWSLambda.APIGatewayEvent) => {
    const request = mapper.mapIngestTweetFromIdRequest(event);
    await twitterService.ingestTweetFromTwitter(request);
    return { statusCode: 200 };
  }
);
