import _ from "lodash";
import {
  ParsedTweet,
  ParsedTweetTextResult,
  Tweet,
  TweetCreated,
  TweetCreateEventUserMention,
  TweetValidationResult
} from "../types/custom";

// Note: A twitter username can only contain alphanumeric characters
// (letters A-Z, numbers 0-9) with the exception of underscores.

const SYSTEM_TWITTER_USERNAME_REGEX = /@BecauseNpm\b/gi;
const EDGE_COMMENT_REGEX = /^\s*([^\s]+)\s+to\s+([^\s]+)\s+(?:bc|b\/c|because|becoz)\s+(.+)$/i;

// TODO test this!
export function validateTweet(tweet: Tweet): TweetValidationResult {
  // TODO there might be a lodash function for doing this:
  let result = mentionsBecauseNpm(tweet);
  if (!result.isValid) {
    return result;
  }

  result = isNotReply(tweet);
  if (!result.isValid) {
    return result;
  }

  result = isNotRetweet(tweet);
  if (!result.isValid) {
    return result;
  }

  result = containsValidComment(tweet);
  return result;
}

export function getTweetTextFromTweet(tweet: Tweet): string {
  if (tweet.extended_tweet) {
    return extractDisplayText(
      tweet.extended_tweet.full_text,
      tweet.extended_tweet.display_text_range
    );
  }
  if (tweet.full_text && tweet.display_text_range) {
    return extractDisplayText(tweet.full_text, tweet.display_text_range);
  }
  return tweet.truncated ? "" : tweet.text || "";
}

export function parseTweet(tweet: TweetCreated): ParsedTweet | null {
  const parsedTweetText = parseTweetText(tweet.text);
  if (!parsedTweetText) {
    return null;
  }
  return {
    id: tweet.id,
    text: tweet.text,
    comment: parsedTweetText.comment,
    tailNodeId: parsedTweetText.tailNodeId,
    headNodeId: parsedTweetText.headNodeId,
    creatorId: tweet.creatorId,
    creatorUsername: tweet.creatorUsername,
    timestampMs: tweet.timestampMs,
    nodesNotFound: false
  };
}

function parseTweetText(text: string): ParsedTweetTextResult | null {
  const cleanedText = text.replace(SYSTEM_TWITTER_USERNAME_REGEX, " ");
  const matches = cleanedText.match(EDGE_COMMENT_REGEX);

  if (matches && matches.length === 4) {
    const comment = matches[3].trim();
    const tailNodeId = matches[1];
    const headNodeId = matches[2];

    if (comment && tailNodeId !== headNodeId) {
      return { comment, tailNodeId, headNodeId };
    }
  }

  return null;
}

function containsValidComment(tweet: Tweet): TweetValidationResult {
  const tweetText = getTweetTextFromTweet(tweet);
  const result = parseTweetText(tweetText);
  return !!result
    ? { isValid: true }
    : { isValid: false, error: `Tweet has invalid text '${tweetText}'` };
}

function mentionsBecauseNpm(tweet: Tweet): TweetValidationResult {
  const entitiesParent = tweet.extended_tweet || tweet;
  const userMentions: TweetCreateEventUserMention[] = _.get(
    entitiesParent,
    "entities.user_mentions"
  );
  const hasMention = _.some(
    userMentions,
    user => user.id_str === process.env.BECAUSE_NPM_USER_ID_STR
  );
  return hasMention
    ? { isValid: true }
    : { isValid: false, error: "Tweet does not mention BecauseNpm" };
}

function isNotReply(tweet: Tweet): TweetValidationResult {
  const isNotReply = !tweet.in_reply_to_status_id_str;
  return isNotReply
    ? { isValid: true }
    : { isValid: false, error: "Tweet is a reply" };
}

function isNotRetweet(tweet: Tweet): TweetValidationResult {
  const isNotRetweet = !tweet.retweeted_status;
  return isNotRetweet
    ? { isValid: true }
    : { isValid: false, error: "Tweet is a retweet" };
}

function extractDisplayText(fullText: string, textRange: number[]): string {
  return fullText.substring(textRange[0], textRange[1]);
}
