import {
  IngestTweetFromIdRequest,
  ReindexTweetRequest,
  TweetCreatedSQSRequest,
  TwitterWebhookRequest,
  WarmUpAPIGatewayEvent
} from "../types/custom";

export function mapTwitterWebhookRequest(
  event: WarmUpAPIGatewayEvent
): TwitterWebhookRequest {
  return {
    crcToken: event.queryStringParameters
      ? event.queryStringParameters["crc_token"] || null
      : null,
    message: event.body ? JSON.parse(event.body) : null
  };
}

export function mapTweetCreatedMessages(
  event: AWSLambda.SQSEvent
): TweetCreatedSQSRequest {
  return {
    messages: event.Records.map(record => JSON.parse(record.body || ""))
  };
}

export function mapIngestTweetFromIdRequest(
  event: AWSLambda.APIGatewayEvent
): IngestTweetFromIdRequest {
  return {
    id: (event.pathParameters || {}).id
  };
}

export function mapReindexTweetRequest(
  event: AWSLambda.APIGatewayEvent
): ReindexTweetRequest {
  return {
    id: (event.pathParameters || {}).id
  };
}
