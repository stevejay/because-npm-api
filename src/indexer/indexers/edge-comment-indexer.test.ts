import { Source } from "../../types/custom";
import * as edgeCommentIndexer from "./edge-comment-indexer";

describe("createDocumentId", () => {
  it("should create the id", () => {
    const comment = {
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
        score: 0.1,
        isNew: true
      },
      headNode: {
        id: "b",
        description: "desc b",
        link: "http://b.com",
        score: 0.2,
        isNew: true
      }
    };
    const actual = edgeCommentIndexer.createDocumentId(comment);
    expect(actual).toEqual("12345678");
  });
});

describe("createDocumentUri", () => {
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
      "http://test.elasticsearch.com/edge-comment/_doc/12345678"
    ]
  ])("comment %o should result in uri %o", (comment, expected) => {
    const actual = edgeCommentIndexer.createDocumentUri(comment);
    expect(actual).toEqual(expected);
  });
});

describe("createDocument", () => {
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
        edgeId: "a b",
        comment: "some comment",
        sourceLink: "http://comment.com",
        sourceUserId: "@User",
        timestampMs: "1111111"
      }
    ]
  ])("comment %o should result in document %o", (comment, expected) => {
    const actual = edgeCommentIndexer.createDocument(comment);
    expect(actual).toEqual(expected);
  });
});
