import * as yup from "yup";
import { Comment, TweetCreated } from "../types/custom";

const TIMESTAMP_REGEX = /^\d+$/;

const tweetCreatedSchema = yup
  .object()
  .shape({
    id: yup
      .string()
      .min(1)
      .max(128)
      .required(),
    text: yup
      .string()
      .min(1)
      .max(3000)
      .required(),
    creatorId: yup
      .string()
      .min(1)
      .max(128)
      .required(),
    creatorUsername: yup
      .string()
      .min(1)
      .max(128)
      .required(),
    timestampMs: yup
      .string()
      .min(1)
      .max(128)
      .matches(TIMESTAMP_REGEX)
      .required()
  })
  .required();

const nodeSchema = yup
  .object()
  .shape({
    id: yup
      .string()
      .min(1)
      .max(128)
      .required(),
    description: yup
      .string()
      .min(1)
      .max(512),
    link: yup
      .string()
      .min(1)
      .max(256)
      .required(),
    score: yup
      .number()
      .min(0)
      .max(1)
      .required(),
    isNew: yup.bool().required()
  })
  .required();

const commentSchema = yup
  .object()
  .shape({
    id: yup
      .string()
      .min(1)
      .max(128)
      .required(),
    comment: yup
      .string()
      .min(1)
      .max(512)
      .required(),
    source: yup
      .mixed()
      .oneOf(["twitter", "app"])
      .required(),
    sourceLink: yup
      .string()
      .min(1)
      .max(256)
      .required(),
    sourceUserId: yup
      .string()
      .min(1)
      .max(128)
      .required(),
    timestampMs: yup
      .string()
      .min(1)
      .max(128)
      .matches(TIMESTAMP_REGEX)
      .required(),
    tailNode: nodeSchema,
    headNode: nodeSchema
  })
  .required();

export async function validateTweetCreatedMessage(
  message: TweetCreated
): Promise<TweetCreated> {
  return (await tweetCreatedSchema.validate(message)) as TweetCreated;
}

export async function validateComment(comment: Comment): Promise<Comment> {
  return (await commentSchema.validate(comment)) as Comment;
}
