import got from "got";
import _ from "lodash";
import * as dynamodbHelper from "../utils/dynamodb-helper";

jest.setTimeout(90000);

const TWEET_TABLE_NAME = "because-npm-tweet-development";

describe("reindex", () => {
  it("should successfully reindex tweets", async () => {
    await addParsedTweet("A0", "react-hot-loader", "react-router-dom");
    await addParsedTweet("A1", "react", "react-router-dom");
    await addParsedTweet("A2", "react-router", "react-router-dom");
    await addParsedTweet("A3", "react-dev-utils", "react-router-dom");
    await addParsedTweet("A4", "react-router-dom", "react-dev-utils");
    await addParsedTweet("A5", "hoist-non-react-statics", "react-dev-utils");
    await addParsedTweet("A6", "@babel/preset-react", "react-dev-utils");
    await addParsedTweet("A7", "reselect", "classnames");
    await addParsedTweet("A8", "reselect", "prop-types");
    await addParsedTweet("A9", "reselect", "react-hot-loader");

    await reindexParsedTweet("A0");
    await reindexParsedTweet("A1");
    await reindexParsedTweet("A2");
    await reindexParsedTweet("A3");
    await reindexParsedTweet("A4");
    await reindexParsedTweet("A5");
    await reindexParsedTweet("A6");
    await reindexParsedTweet("A7");
    await reindexParsedTweet("A8");
    await reindexParsedTweet("A9");
  });
});

async function reindexParsedTweet(id: string) {
  await got(`http://localhost:3010/tweet/${id}/reindex`, {
    method: "POST",
    json: true
  });
}

async function addParsedTweet(
  id: string,
  tailNodeId: string,
  headNodeId: string
) {
  const comment = `${headNodeId} is better than ${tailNodeId}`;
  const document = {
    id,
    creatorId: "2222",
    creatorUsername: "Steve",
    timestampMs: 11111111111111,
    text: `@BecauseNpm ${tailNodeId} to ${headNodeId} bc ${comment}`,
    comment,
    tailNodeId,
    headNodeId,
    nodesNotFound: false
  };
  await dynamodbHelper.addDocumentToTable(TWEET_TABLE_NAME, document);
}
