import * as AWS from "aws-sdk";
import delay from "delay";
import { flushS3Bucket } from "flush-s3-bucket";
import _ from "lodash";

const s3 = new AWS.S3({
  endpoint: "http://localhost:4572/",
  region: "development/eu-west-1",
  s3ForcePathStyle: true
});

async function createBucket(bucketName: string) {
  await s3.createBucket({ Bucket: bucketName }).promise();
}

async function getAllBucketNames() {
  const response = await s3.listBuckets().promise();
  return response.Buckets ? response.Buckets.map(bucket => bucket.Name) : [];
}

export async function createBucketIfMissing(bucketName: string) {
  const existingNames = await getAllBucketNames();
  if (!_.includes(existingNames, bucketName)) {
    await createBucket(bucketName);
  }
}

async function getObject(bucketName: string, key: string) {
  const obj = await s3
    .getObject({
      Bucket: bucketName,
      Key: key
    })
    .promise();
  return obj.Body ? obj.Body.toString() : null;
}

export async function eventuallyGetObject(
  bucketName: string,
  key: string,
  maxTries: number
) {
  let tries = 0;
  let lastError = null;

  while (true) {
    try {
      return await getObject(bucketName, key);
    } catch (error) {
      lastError = error;
    }

    tries = tries + 1;
    if (tries > maxTries) {
      throw new Error(
        `The object ${key} in bucket ${bucketName} did not appear in time ${
          lastError ? lastError.message : ""
        }`
      );
    } else {
      await delay(1000);
    }
  }
}

export async function deleteAllFilesInBucket(bucketName: string) {
  await new Promise((resolve, reject) => {
    flushS3Bucket(s3, bucketName, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
