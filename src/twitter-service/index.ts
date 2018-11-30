import log from "loglevel";
import * as indexer from "../indexer";
import * as nodeService from "../node-service";
import * as notifier from "../notifier";
import * as tweetPersister from "../tweet-persister";
import {
  HttpResponse,
  IngestTweetFromIdRequest,
  ReindexTweetRequest,
  TweetCreated,
  TwitterWebhookRequest
} from "../types/custom";
import computeResponseToken from "./compute-response-token";
import * as mapper from "./mapper";
import * as messageParser from "./message-parser";
import * as tweetParser from "./tweet-parser";
import * as twitterApi from "./twitter-api";
import * as validator from "./validator";

export async function handleTwitterWebhookRequest(
  request: TwitterWebhookRequest
): Promise<HttpResponse> {
  if (request.crcToken) {
    try {
      const responseToken = await computeResponseToken(request.crcToken);
      log.info("Twitter verification", responseToken);
      return {
        statusCode: 200,
        body: JSON.stringify({ response_token: responseToken })
      };
    } catch (error) {
      log.error(error);
      return { statusCode: 400 };
    }
  }

  if (request.message) {
    const tweetsCreated = messageParser.parseTwitterWebhookMessage(
      request.message
    );
    if (tweetsCreated.length) {
      log.debug(
        `Received ${tweetsCreated.length} create messages from Twitter`
      );
      await notifier.sendTweetCreatedMessages(tweetsCreated);
    }
  }

  return { statusCode: 200 };
}

export async function processTweetCreatedMessage(
  message: TweetCreated
): Promise<void> {
  try {
    const validatedMessage = await validator.validateTweetCreatedMessage(
      message
    );
    const parsedTweet = tweetParser.parseTweet(validatedMessage);
    if (!parsedTweet) {
      log.warn("tweet text has wrong format", message.id, message.text);
      return;
    }
    await tweetPersister.saveValidTweet(parsedTweet);
    const nodeSearchResult = await nodeService.findReferencedNodes(parsedTweet);

    if (!nodeSearchResult) {
      log.warn(
        `ignoring tweet ${validatedMessage.id} from ${
          validatedMessage.creatorUsername
        } as one or more packages could not be found from tweet text ${
          validatedMessage.text
        }`
      );
      await tweetPersister.saveValidTweet({
        ...parsedTweet,
        nodesNotFound: false
      });
      return;
    }

    const comment = mapper.mapParsedTweetToComment(
      parsedTweet,
      nodeSearchResult
    );
    const validatedComment = await validator.validateComment(comment);
    await indexer.indexComment(validatedComment);
  } catch (err) {
    log.error("failed to add comment from tweet", err);
    if (!message || !message.text) {
      return;
    }
    try {
      await tweetPersister.saveFailedTweet(message);
    } catch (err) {
      log.error("failed to save failed tweet message", err);
    }
  }
}

export async function ingestTweetFromTwitter(
  request: IngestTweetFromIdRequest
) {
  const tweetStatusResponse = await twitterApi.getTweetById(request.id);
  const tweetCreated = mapper.mapTweetStatusResponse(tweetStatusResponse);
  if (!tweetCreated) {
    throw new Error(
      `[400] Tweet with id ${request.id} is not a valid BecauseNpm tweet`
    );
  }
  log.debug(
    `Triggering ingest of valid BecauseNpm tweet with id ${request.id}`
  );
  await notifier.sendTweetCreatedMessages([tweetCreated]);
}

export async function reindexTweet(request: ReindexTweetRequest) {
  const parsedTweet = await tweetPersister.getSavedValidTweet(request.id);
  const nodeSearchResult = await nodeService.findReferencedNodes(parsedTweet);
  if (!nodeSearchResult) {
    throw new Error(
      `[404] One or more packages not found from ${
        parsedTweet.tailNodeId
      } and ${parsedTweet.headNodeId}`
    );
  }
  if (parsedTweet.nodesNotFound) {
    await tweetPersister.saveValidTweet({
      ...parsedTweet,
      nodesNotFound: false
    });
  }
  const comment = mapper.mapParsedTweetToComment(parsedTweet, nodeSearchResult);
  const validatedComment = await validator.validateComment(comment);
  await indexer.indexComment(validatedComment);
}
