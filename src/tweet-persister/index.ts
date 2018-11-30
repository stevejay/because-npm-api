import dynamodbWrapper from "../library-wrappers/dynamodb-wrapper";
import * as s3Wrapper from "../library-wrappers/s3-wrapper";
import { ParsedTweet, TweetCreated } from "../types/custom";
import * as mapper from "./mapper";

export async function saveFailedTweet(message: TweetCreated) {
  const document = mapper.mapFailedTweetToS3Document(message);
  await s3Wrapper.putObject(document);
}

export async function saveValidTweet(tweet: ParsedTweet) {
  const document = mapper.mapValidTweetToDynamoDBDocument(tweet);
  await dynamodbWrapper.put({
    TableName: process.env.SERVERLESS_TWEET_TABLE_NAME,
    Item: document
  });
}

export async function getSavedValidTweet(id: string): Promise<ParsedTweet> {
  const document = await dynamodbWrapper.get({
    TableName: process.env.SERVERLESS_TWEET_TABLE_NAME,
    Key: { id }
  });
  return mapper.mapDynamoDBDocumentToTweet(document);
}
