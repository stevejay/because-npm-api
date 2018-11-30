import { Source } from "../types/custom";
import * as mapper from "./mapper";

describe("mapIndexNodeRequest", () => {
  test.each([
    [
      {
        id: "redux",
        description: "Some description",
        link: "https://www.npmjs.com/package/redux",
        score: 0.9
      },
      {
        uri: "http://test.elasticsearch.com/node/_doc/redux",
        body: {
          idMatchQueryText: "redux",
          suggest: [{ input: ["redux"], weight: 100 }],
          description: "Some description",
          link: "https://www.npmjs.com/package/redux",
          score: 0.9
        }
      }
    ]
  ])("should map %o to request %o", (node, expected) => {
    const actual = mapper.mapIndexNodeRequest(node);
    expect(actual).toEqual(expected);
  });
});

describe("mapIndexNodeRequestForBulkApi", () => {
  test.each([
    [
      {
        id: "redux",
        description: "Some description",
        link: "https://www.npmjs.com/package/redux",
        score: 0.9
      },
      {
        actionAndMetadata: {
          index: {
            _index: "node",
            _type: "_doc",
            _id: "redux"
          }
        },
        doc: {
          idMatchQueryText: "redux",
          suggest: [{ input: ["redux"], weight: 100 }],
          description: "Some description",
          link: "https://www.npmjs.com/package/redux",
          score: 0.9
        }
      }
    ]
  ])("should map %o to request %o", (node, expected) => {
    const actual = mapper.mapIndexNodeRequestForBulkApi(node);
    expect(actual).toEqual(expected);
  });
});

describe("mapIndexEdgeRequest", () => {
  test.each([
    [
      {
        id: "12345678",
        comment: "some comment",
        source: Source.Twitter,
        sourceLink: "http://comment.com",
        sourceUserId: "@User",
        timestampMs: "1111111",
        tailNode: {
          id: "a",
          description: "desc a",
          link: "http://a.com",
          score: 0.1
        },
        headNode: {
          id: "b",
          description: "desc b",
          link: "http://b.com",
          score: 0.2
        }
      },
      {
        uri: "http://test.elasticsearch.com/edge/_doc/a%20b",
        body: {
          tailNodeId: "a",
          headNodeId: "b",
          score: 0.2
        }
      }
    ]
  ])("should map %o to request %o", (comment, expected) => {
    const actual = mapper.mapIndexEdgeRequest(comment);
    expect(actual).toEqual(expected);
  });
});

describe("mapIndexEdgeRequestForBulkApi", () => {
  test.each([
    [
      {
        id: "12345678",
        comment: "some comment",
        source: Source.Twitter,
        sourceLink: "http://comment.com",
        sourceUserId: "@User",
        timestampMs: "1111111",
        tailNode: {
          id: "a",
          description: "desc a",
          link: "http://a.com",
          score: 0.1
        },
        headNode: {
          id: "b",
          description: "desc b",
          link: "http://b.com",
          score: 0.2
        }
      },
      {
        actionAndMetadata: {
          index: {
            _index: "edge",
            _type: "_doc",
            _id: "a b"
          }
        },
        doc: {
          tailNodeId: "a",
          headNodeId: "b",
          score: 0.2
        }
      }
    ]
  ])("should map %o to request %o", (comment, expected) => {
    const actual = mapper.mapIndexEdgeRequestForBulkApi(comment);
    expect(actual).toEqual(expected);
  });
});

describe("mapIndexEdgeCommentRequest", () => {
  test.each([
    [
      {
        id: "12345678",
        comment: "some comment",
        source: Source.Twitter,
        sourceLink: "http://comment.com",
        sourceUserId: "@User",
        timestampMs: "1111111",
        tailNode: {
          id: "a",
          description: "desc a",
          link: "http://a.com",
          score: 0.1
        },
        headNode: {
          id: "b",
          description: "desc b",
          link: "http://b.com",
          score: 0.2
        }
      },
      {
        uri: "http://test.elasticsearch.com/edge-comment/_doc/12345678",
        body: {
          edgeId: "a b",
          comment: "some comment",
          sourceLink: "http://comment.com",
          sourceUserId: "@User",
          timestampMs: "1111111"
        }
      }
    ]
  ])("should map %o to request %o", (comment, expected) => {
    const actual = mapper.mapIndexEdgeCommentRequest(comment);
    expect(actual).toEqual(expected);
  });
});

describe("mapIndexEdgeCommentRequestForBulkApi", () => {
  test.each([
    [
      {
        id: "12345678",
        comment: "some comment",
        source: Source.Twitter,
        sourceLink: "http://comment.com",
        sourceUserId: "@User",
        timestampMs: "1111111",
        tailNode: {
          id: "a",
          description: "desc a",
          link: "http://a.com",
          score: 0.1
        },
        headNode: {
          id: "b",
          description: "desc b",
          link: "http://b.com",
          score: 0.2
        }
      },
      {
        actionAndMetadata: {
          index: {
            _index: "edge-comment",
            _type: "_doc",
            _id: "12345678"
          }
        },
        doc: {
          edgeId: "a b",
          comment: "some comment",
          sourceLink: "http://comment.com",
          sourceUserId: "@User",
          timestampMs: "1111111"
        }
      }
    ]
  ])("should map %o to request %o", (comment, expected) => {
    const actual = mapper.mapIndexEdgeCommentRequestForBulkApi(comment);
    expect(actual).toEqual(expected);
  });
});

// TODO test mapMultiIndexRequestForBulkApi
