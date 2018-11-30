import * as AWS from "aws-sdk";

const s3 = new AWS.S3(
  process.env.NODE_ENV === "development" ? getDevOptions() : undefined
);

export function putObject(document: AWS.S3.PutObjectRequest) {
  return s3.putObject(document).promise();
}

function getDevOptions() {
  return {
    endpoint: process.env.S3_URI,
    region: process.env.S3_REGION,
    s3ForcePathStyle: true
  };
}
