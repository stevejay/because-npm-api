import * as AWS from "aws-sdk";
import _ from "lodash";
import log from "loglevel";
import { TweetCreated } from "../types/custom";
import * as mapper from "./mapper";

const sqs = new AWS.SQS(
  process.env.NODE_ENV === "development" ? getDevOptions() : undefined
);

export async function sendTweetCreatedMessages(tweetsCreated: TweetCreated[]) {
  const queueUrl = await getTweetCreatedQueueUrl();

  // TODO use mapper:
  const messages = tweetsCreated.map(tweetCreated => ({
    id: tweetCreated.id,
    json: tweetCreated
  }));

  const messageBatches = mapper.mapMessagesForBatchRequests(messages, queueUrl);
  await Promise.all(messageBatches.map(sendMessageBatch));
}

let cachedTweetCreatedQueueUrl: string = "";

async function getTweetCreatedQueueUrl() {
  if (!cachedTweetCreatedQueueUrl) {
    log.debug(
      "trying to get queue url for queue",
      process.env.TWEET_CREATED_QUEUE_NAME
    );
    const getQueueUrlResponse = await sqs
      .getQueueUrl({ QueueName: process.env.TWEET_CREATED_QUEUE_NAME || "" })
      .promise();
    cachedTweetCreatedQueueUrl = getQueueUrlResponse.QueueUrl || "";
  }
  return cachedTweetCreatedQueueUrl;
}

async function sendMessageBatch(messageBatch: AWS.SQS.SendMessageBatchRequest) {
  if (log.getLevel() <= log.levels.DEBUG) {
    log.debug("sending message batch", JSON.stringify(messageBatch));
  }
  return sqs.sendMessageBatch(messageBatch).promise();
}

function getDevOptions() {
  return {
    endpoint: process.env.SQS_URI,
    region: process.env.SQS_REGION
  };
}
