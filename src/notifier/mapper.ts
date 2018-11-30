import _ from "lodash";
import { Message } from "../types/custom";

const MAX_SEND_MESSAGE_BATCH = 10;

export function mapMessagesForBatchRequests(
  messages: Message[],
  queueUrl: string
): AWS.SQS.SendMessageBatchRequest[] {
  return _.chunk(
    messages.map(mapMessageForBatchRequest),
    MAX_SEND_MESSAGE_BATCH
  ).map(messageBatch => ({
    Entries: messageBatch,
    QueueUrl: queueUrl
  }));
}

function mapMessageForBatchRequest(
  message: Message
): AWS.SQS.SendMessageBatchRequestEntry {
  return {
    Id: message.id,
    MessageBody: JSON.stringify(message.json)
  };
}
