import * as mapper from "./mapper";

describe("mapValidTweetToDynamoDBDocument", () => {
  test.each([
    [
      {
        id: "12345678",
        text: "bar",
        timestampMs: "9543069976000",
        creatorId: "222222222",
        creatorUsername: "Steve",
        comment: "some comment",
        tailNodeId: "react",
        headNodeId: "vuejs",
        nodesNotFound: true
      },
      {
        id: "12345678",
        text: "bar",
        timestampMs: 9543069976000,
        creatorId: "222222222",
        creatorUsername: "Steve",
        comment: "some comment",
        tailNodeId: "react",
        headNodeId: "vuejs",
        nodesNotFound: true
      }
    ]
  ])("%o should map to %o", (message, expected) => {
    const actual = mapper.mapValidTweetToDynamoDBDocument(message);
    expect(actual).toEqual(expected);
  });
});

describe("mapFailedTweetToS3Document", () => {
  test.each([
    [
      {
        id: "12345678",
        text: "bar",
        timestampMs: "333333333"
      },
      {
        // tslint:disable-next-line
        Body: '{"id":"12345678","text":"bar","timestampMs":"333333333"}',
        Bucket: "FailedTweetsBucket",
        Key: "12/34/12345678"
      }
    ]
  ])("%o should map to %o", (message, expected) => {
    const actual = mapper.mapFailedTweetToS3Document(message);
    expect(actual).toEqual(expected);
  });
});

describe("mapDynamoDBDocumentToTweet", () => {
  test.each([
    [
      {
        id: "12345678",
        text: "bar",
        timestampMs: 9543069976000,
        creatorId: "222222222",
        creatorUsername: "Steve",
        comment: "some comment",
        tailNodeId: "react",
        headNodeId: "vuejs",
        nodesNotFound: true
      },
      {
        id: "12345678",
        text: "bar",
        timestampMs: "9543069976000",
        creatorId: "222222222",
        creatorUsername: "Steve",
        comment: "some comment",
        tailNodeId: "react",
        headNodeId: "vuejs",
        nodesNotFound: true
      }
    ]
  ])("%o should map to %o", (message, expected) => {
    const actual = mapper.mapDynamoDBDocumentToTweet(message);
    expect(actual).toEqual(expected);
  });
});
