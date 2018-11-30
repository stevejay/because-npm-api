import log from "loglevel";
import * as Twit from "twit";
import {
  Comment,
  ParsedTweet,
  ReferencedNodes,
  Source,
  Tweet,
  TweetCreated
} from "../types/custom";
import * as tweetParser from "./tweet-parser";

export function mapParsedTweetToComment(
  parsedTweet: ParsedTweet,
  nodeSearchResult: ReferencedNodes
): Comment {
  return {
    id: parsedTweet.id,
    comment: parsedTweet.comment,
    source: Source.Twitter,
    sourceLink: createSourceLink(parsedTweet.creatorUsername, parsedTweet.id),
    sourceUserId: parsedTweet.creatorUsername,
    timestampMs: parsedTweet.timestampMs,
    tailNode: nodeSearchResult.tailNode,
    headNode: nodeSearchResult.headNode
  };
}

export function mapTweetToTweetCreated(tweet: Tweet): TweetCreated {
  return {
    id: tweet.id_str,
    text: tweetParser.getTweetTextFromTweet(tweet),
    creatorId: tweet.user.id_str,
    creatorUsername: tweet.user.screen_name,
    timestampMs: mapStringDateToTimestampMs(tweet.created_at)
  };
}

export function mapTweetStatusResponse(
  response: Twit.PromiseResponse
): TweetCreated | null {
  if (log.getLevel() <= log.levels.TRACE) {
    log.debug("twitter status response data", JSON.stringify(response.data));
  }
  const tweet = <Tweet>response.data;
  const result = tweetParser.validateTweet(tweet);
  if (!result.isValid) {
    throw new Error(`[400] Tweet is not valid: ${result.error}`);
  }
  // TODO SJ I think this does the same work as validateTweet again:
  return mapTweetToTweetCreated(tweet);
}

function mapStringDateToTimestampMs(createdAt: string): string {
  return Date.parse(createdAt)
    .valueOf()
    .toString();
}

function createSourceLink(creatorUsername: string, tweetId: string): string {
  return `https://twitter.com/${creatorUsername}/status/${tweetId}`;
}
