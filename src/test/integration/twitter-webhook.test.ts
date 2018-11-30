import got from "got";
import _ from "lodash";
import * as constants from "../../constants";
import * as dynamodbHelper from "../utils/dynamodb-helper";
import * as esHelper from "../utils/es-helper";
import * as s3Helper from "../utils/s3-helper";
import * as sqsHelper from "../utils/sqs-helper";

jest.setTimeout(90000);

const TWITTER_WEBHOOK_LAMBDA_URI = "http://localhost:3010/twitter/webhook";
const GRAPHQL_LAMBDA_URI = "http://localhost:3010/search/graphql";
const BECAUSE_NPM_USER_ID_STR = "1034797758107009024";
const TWEET_CREATED_QUEUE_NAME = "because-npm-tweet-created-development";
const FAILED_TWEETS_BUCKET_NAME = "because-npm-failed-tweets-development";
const TWEET_TABLE_NAME = "because-npm-tweet-development";

describe("verification", () => {
  it("should respond to a twitter verification request", async () => {
    const response = await got(`${TWITTER_WEBHOOK_LAMBDA_URI}?crc_token=1234`);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
    expect(JSON.parse(response.body)).toEqual({
      response_token: expect.stringMatching(/^sha256=.+/)
    });
  });

  it("should handle a twitter tweet_create_events request with a valid tweet", async () => {
    await s3Helper.createBucketIfMissing(FAILED_TWEETS_BUCKET_NAME);
    await s3Helper.deleteAllFilesInBucket(FAILED_TWEETS_BUCKET_NAME);

    await sqsHelper.deleteQueue(TWEET_CREATED_QUEUE_NAME);
    await sqsHelper.createQueue(TWEET_CREATED_QUEUE_NAME);

    await dynamodbHelper.deleteDocumentFromTable(TWEET_TABLE_NAME, "12345678");
    await dynamodbHelper.deleteDocumentFromTable(TWEET_TABLE_NAME, "22345678");

    const response = await got(TWITTER_WEBHOOK_LAMBDA_URI, {
      method: "POST",
      json: true,
      body: {
        for_user_id: BECAUSE_NPM_USER_ID_STR,
        tweet_create_events: [
          {
            id_str: "12345678",
            text: "@BecauseNpm foo to bar because some reason",
            user: { id_str: "22222222", screen_name: "@SomeGuy" },
            in_reply_to_status_id_str: null,
            created_at: "Mon Sep 03 10:02:06 +0000 2018",
            entities: {
              user_mentions: [
                {
                  screen_name: "BecauseNpm",
                  name: "BecauseNpm",
                  id_str: BECAUSE_NPM_USER_ID_STR
                }
              ]
            }
          }
        ]
      }
    });

    expect(response.statusCode).toEqual(200);

    const document = await dynamodbHelper.eventuallyGetDocument(
      TWEET_TABLE_NAME,
      "12345678",
      60
    );

    expect(document).toEqual({
      id: "12345678",
      text: "@BecauseNpm foo to bar because some reason",
      creatorId: "22222222",
      creatorUsername: "@SomeGuy",
      timestampMs: 1535968926000,
      comment: "some reason",
      headNodeId: "bar",
      tailNodeId: "foo",
      nodesNotFound: false
    });

    const nodeOne = await esHelper.eventuallyGetDocument(
      constants.NODE_SEARCH_INDEX_NAME,
      "foo",
      10
    );

    expect(nodeOne).toEqual({
      idMatchQueryText: "foo",
      suggest: [{ input: ["foo"], weight: 100 }],
      description: "An opinionated git cli for oss",
      link: "https://www.npmjs.com/package/foo",
      score: expect.anything()
    });

    const nodeTwo = await esHelper.eventuallyGetDocument(
      constants.NODE_SEARCH_INDEX_NAME,
      "bar",
      10
    );

    expect(nodeTwo).toEqual({
      idMatchQueryText: "bar",
      suggest: [{ input: ["bar"], weight: 100 }],
      description: expect.stringMatching(/.+/),
      link: "https://www.npmjs.com/package/bar",
      score: expect.anything()
    });

    const edge = await esHelper.eventuallyGetDocument(
      constants.EDGE_SEARCH_INDEX_NAME,
      "foo bar",
      10
    );

    expect(edge).toEqual({
      tailNodeId: "foo",
      headNodeId: "bar",
      score: nodeTwo.score
    });

    const edgeComment = await esHelper.eventuallyGetDocument(
      constants.EDGE_COMMENT_SEARCH_INDEX_NAME,
      "12345678",
      10
    );

    expect(edgeComment).toEqual({
      edgeId: "foo bar",
      comment: "some reason",
      sourceLink: "https://twitter.com/@SomeGuy/status/12345678",
      sourceUserId: "@SomeGuy",
      timestampMs: "1535968926000"
    });
  });

  it("should handle a twitter tweet_create_events request with a valid scoped package tweet", async () => {
    await s3Helper.createBucketIfMissing(FAILED_TWEETS_BUCKET_NAME);
    await s3Helper.deleteAllFilesInBucket(FAILED_TWEETS_BUCKET_NAME);

    await sqsHelper.deleteQueue(TWEET_CREATED_QUEUE_NAME);
    await sqsHelper.createQueue(TWEET_CREATED_QUEUE_NAME);

    await dynamodbHelper.deleteDocumentFromTable(TWEET_TABLE_NAME, "12345678");
    await dynamodbHelper.deleteDocumentFromTable(TWEET_TABLE_NAME, "22345678");

    const response = await got(TWITTER_WEBHOOK_LAMBDA_URI, {
      method: "POST",
      json: true,
      body: {
        for_user_id: BECAUSE_NPM_USER_ID_STR,
        tweet_create_events: [
          {
            id_str: "22345678",
            text:
              "@BecauseNpm @redux-offline/redux-offline to @angular-redux/store because some reason",
            user: { id_str: "22222222", screen_name: "@SomeGuy" },
            in_reply_to_status_id_str: null,
            created_at: "Mon Sep 03 10:02:06 +0000 2018",
            entities: {
              user_mentions: [
                {
                  screen_name: "BecauseNpm",
                  name: "BecauseNpm",
                  id_str: BECAUSE_NPM_USER_ID_STR
                }
              ]
            }
          }
        ]
      }
    });

    expect(response.statusCode).toEqual(200);

    const document = await dynamodbHelper.eventuallyGetDocument(
      TWEET_TABLE_NAME,
      "22345678",
      60
    );

    expect(document).toEqual({
      id: "22345678",
      text:
        "@BecauseNpm @redux-offline/redux-offline to @angular-redux/store because some reason",
      creatorId: "22222222",
      creatorUsername: "@SomeGuy",
      timestampMs: 1535968926000,
      comment: "some reason",
      headNodeId: "@angular-redux/store",
      tailNodeId: "@redux-offline/redux-offline",
      nodesNotFound: false
    });

    const nodeOne = await esHelper.eventuallyGetDocument(
      constants.NODE_SEARCH_INDEX_NAME,
      "@redux-offline/redux-offline",
      10
    );

    expect(nodeOne).toEqual({
      idMatchQueryText: "redux offline reduxoffline",
      suggest: [
        { input: ["reduxoffline", "@reduxofflinereduxoffline"], weight: 100 },
        { input: ["reduxofflinereduxoffline"], weight: 66 },
        { input: ["offline"], weight: 33 }
      ],
      description: expect.stringMatching(/.+/),
      link: "https://www.npmjs.com/package/%40redux-offline%2Fredux-offline",
      score: expect.anything()
    });

    const nodeTwo = await esHelper.eventuallyGetDocument(
      constants.NODE_SEARCH_INDEX_NAME,
      "@angular-redux/store",
      10
    );

    expect(nodeTwo).toEqual({
      idMatchQueryText: "angular redux store angularredux",
      suggest: [
        { input: ["store", "@angularreduxstore"], weight: 100 },
        { input: ["angularreduxstore"], weight: 66 }
      ],
      description: expect.stringMatching(/.+/),
      link: "https://www.npmjs.com/package/%40angular-redux%2Fstore",
      score: expect.anything()
    });

    const nodeSearchResult = await got(GRAPHQL_LAMBDA_URI, {
      method: "POST",
      json: true,
      body: {
        operationName: "NodeSearch",
        variables: { first: 10, term: "@redux-offline/redux-offline" },
        query:
          // tslint:disable-next-line
          "query NodeSearch($term: String!, $first: Int = 24) {  nodeSearch(term: $term, first: $first) {\n    edges {\n      node {\n id\n      link\n      description\n      __typename\n  }\n  }\n    __typename\n  }\n}"
      }
    });

    // TODO this is a fragile response
    expect(nodeSearchResult.body).toEqual({
      data: {
        nodeSearch: {
          edges: [
            {
              node: {
                id: "@redux-offline/redux-offline",
                link:
                  "https://www.npmjs.com/package/%40redux-offline%2Fredux-offline",
                description: "Redux Offline-First Architecture",
                __typename: "Node"
              }
            },
            {
              node: {
                __typename: "Node",
                description: "Angular bindings for Redux",
                id: "@angular-redux/store",
                link: "https://www.npmjs.com/package/%40angular-redux%2Fstore"
              }
            }
          ],
          __typename: "NodeSearchConnection"
        }
      }
    });

    const edge = await esHelper.eventuallyGetDocument(
      constants.EDGE_SEARCH_INDEX_NAME,
      "@redux-offline/redux-offline @angular-redux/store",
      10
    );

    expect(edge).toEqual({
      tailNodeId: "@redux-offline/redux-offline",
      headNodeId: "@angular-redux/store",
      score: nodeTwo.score
    });

    const edgeComment = await esHelper.eventuallyGetDocument(
      constants.EDGE_COMMENT_SEARCH_INDEX_NAME,
      "22345678",
      10
    );

    expect(edgeComment).toEqual({
      edgeId: "@redux-offline/redux-offline @angular-redux/store",
      comment: "some reason",
      sourceLink: "https://twitter.com/@SomeGuy/status/22345678",
      sourceUserId: "@SomeGuy",
      timestampMs: "1535968926000"
    });
  });
});
