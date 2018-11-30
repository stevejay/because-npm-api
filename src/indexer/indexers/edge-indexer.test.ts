import { Source } from "../../types/custom";
import * as edgeIndexer from "./edge-indexer";

describe("createDocumentId", () => {
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
      "a b"
    ]
  ])("comment %o should result in uri %o", (comment, expected) => {
    const actual = edgeIndexer.createDocumentId(comment);
    expect(actual).toEqual(expected);
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
      "http://test.elasticsearch.com/edge/_doc/a%20b"
    ]
  ])("comment %o should result in uri %o", (comment, expected) => {
    const actual = edgeIndexer.createDocumentUri(comment);
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
        tailNodeId: "a",
        headNodeId: "b",
        score: 0.2
      }
    ]
  ])("comment %o should result in document %o", (comment, expected) => {
    const actual = edgeIndexer.createDocument(comment);
    expect(actual).toEqual(expected);
  });
});
