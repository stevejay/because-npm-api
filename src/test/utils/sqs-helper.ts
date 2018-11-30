import * as AWS from "aws-sdk";

const sqs = new AWS.SQS({
  endpoint: "http://localhost:4576/",
  region: "development/eu-west-1"
});

export async function deleteQueue(queueName: string) {
  let queueUrl: string | null = null;
  try {
    queueUrl = await getQueueUrl(queueName);
  } catch {}
  if (!queueUrl) {
    return;
  }
  await sqs.deleteQueue({ QueueUrl: queueUrl }).promise();
}

export async function createQueue(queueName: string) {
  return await sqs.createQueue({ QueueName: queueName }).promise();
}

async function purgeQueue(queueName: string) {
  const queueUrl = await getQueueUrl(queueName);
  return await sqs.purgeQueue({ QueueUrl: queueUrl }).promise();
}

async function getQueueUrl(queueName: string): Promise<string> {
  const response = await sqs.getQueueUrl({ QueueName: queueName }).promise();
  return response.QueueUrl || "";
}

export async function createOrPurgeQueue(queueName: string) {
  let queueUrl: string | null = null;
  try {
    queueUrl = await getQueueUrl(queueName);
  } catch {}
  if (!queueUrl) {
    await createQueue(queueName);
  } else {
    await purgeQueue(queueName);
  }
}

export async function getMessages(
  queueName: string
): Promise<AWS.SQS.Message[]> {
  const queueUrl = await getQueueUrl(queueName);
  const messages = await sqs
    .receiveMessage({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10
    })
    .promise();
  await Promise.all(
    (messages.Messages || []).map(message =>
      sqs
        .deleteMessage({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle || ""
        })
        .promise()
    )
  );
  return messages.Messages || [];
}
