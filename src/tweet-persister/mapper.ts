import { S3 } from "aws-sdk";
import { ParsedTweet, TweetCreated } from "../types/custom";
import createBucketKey from "./create-bucket-key";

const FAILED_TWEETS_BUCKET = process.env.FAILED_TWEETS_BUCKET || "";

export function mapValidTweetToDynamoDBDocument(tweet: ParsedTweet) {
  return {
    id: tweet.id,
    timestampMs: Number(tweet.timestampMs),
    creatorId: tweet.creatorId,
    creatorUsername: tweet.creatorUsername,
    text: tweet.text,
    comment: tweet.comment,
    tailNodeId: tweet.tailNodeId,
    headNodeId: tweet.headNodeId,
    nodesNotFound: tweet.nodesNotFound
  };
}

export function mapDynamoDBDocumentToTweet(document: any): ParsedTweet {
  return {
    id: document.id,
    text: document.text,
    creatorId: document.creatorId,
    creatorUsername: document.creatorUsername,
    timestampMs: `${document.timestampMs}`,
    comment: document.comment,
    tailNodeId: document.tailNodeId,
    headNodeId: document.headNodeId,
    nodesNotFound: document.nodesNotFound
  };
}

export function mapFailedTweetToS3Document(
  message: TweetCreated
): S3.PutObjectRequest {
  return {
    Body: JSON.stringify(message),
    Bucket: FAILED_TWEETS_BUCKET,
    Key: createBucketKey(message.id)
  };
}
