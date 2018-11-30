import * as edgeCommentsSearcher from "./edge-comments";

describe("createRequest", () => {
  test.each([
    [
      "foo bar",
      10,
      null,
      {
        uri: "http://test.elasticsearch.com/edge-comment/_doc/_search",
        body: {
          _source: [
            "edgeId",
            "comment",
            "sourceLink",
            "sourceUserId",
            "timestampMs"
          ],
          size: 10,
          query: {
            bool: {
              must: [{ term: { edgeId: "foo bar" } }]
            }
          },
          sort: [{ timestampMs: "desc" }, { _id: "asc" }]
        }
      }
    ],
    [
      "foo bar",
      10,
      [33333333, "12345678"],
      {
        uri: "http://test.elasticsearch.com/edge-comment/_doc/_search",
        body: {
          _source: [
            "edgeId",
            "comment",
            "sourceLink",
            "sourceUserId",
            "timestampMs"
          ],
          search_after: [33333333, "12345678"],
          size: 10,
          query: {
            bool: {
              must: [{ term: { edgeId: "foo bar" } }]
            }
          },
          sort: [{ timestampMs: "desc" }, { _id: "asc" }]
        }
      }
    ]
  ])(
    "should map edge %s with size %s and cursor %o to %o",
    (edgeId, size, cursor, expected) => {
      const actual = edgeCommentsSearcher.createRequest(edgeId, size, cursor);
      expect(actual).toEqual(expected);
    }
  );
});

describe("mapResponse", () => {
  test.each([
    [
      {
        body: {
          hits: {
            total: 1,
            hits: [
              {
                _index: "edge-comment",
                _id: "12345678",
                _source: {
                  edgeId: "foo bar",
                  sourceLink: "https://twitter.com/@SomeGuy/status/12345678",
                  comment: "some reason",
                  sourceUserId: "@SomeGuy",
                  timestampMs: 4444444
                },
                sort: [33333333, "12345678"]
              }
            ]
          }
        }
      },
      10,
      {
        edgeComments: [
          {
            id: "12345678",
            edgeId: "foo bar",
            comment: "some reason",
            sourceLink: "https://twitter.com/@SomeGuy/status/12345678",
            sourceUserId: "@SomeGuy",
            timestampMs: 4444444,
            cursor: [33333333, "12345678"]
          }
        ],
        hasMore: false
      }
    ]
  ])(
    "should map response %o with size %s to %o",
    (response, size, expected) => {
      const actual = edgeCommentsSearcher.mapResponse(response, size);
      expect(actual).toEqual(expected);
    }
  );
});
