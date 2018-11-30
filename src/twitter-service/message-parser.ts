import _ from "lodash";
import log from "loglevel";
import { TweetCreated, TwitterWebhookMessage } from "../types/custom";
import * as mapper from "./mapper";
import * as tweetParser from "./tweet-parser";

export function parseTwitterWebhookMessage(
  message: TwitterWebhookMessage
): TweetCreated[] {
  if (message.for_user_id !== process.env.BECAUSE_NPM_USER_ID_STR) {
    log.error("Message is not for BecauseNpm user");
    return [];
  }

  if (log.getLevel() <= log.levels.DEBUG) {
    log.debug(
      "message tweet_create_events content",
      JSON.stringify(message.tweet_create_events)
    );
  }

  return (message.tweet_create_events || [])
    .filter(tweet => tweetParser.validateTweet(tweet).isValid)
    .map(mapper.mapTweetToTweetCreated);
}
