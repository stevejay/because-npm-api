import * as edgesSearcher from "./edges";

describe("createRequest", () => {
  test.each([
    [
      "react",
      10,
      null,
      {
        uri: "http://test.elasticsearch.com/edge/_doc/_search",
        body: {
          _source: ["tailNodeId", "headNodeId", "score"],
          size: 10,
          query: {
            bool: {
              must: [{ term: { tailNodeId: "react" } }]
            }
          },
          sort: [{ score: "desc" }, { headNodeId: "asc" }, { _id: "asc" }]
        }
      }
    ],
    [
      "react",
      10,
      [0.10018775621583653, "bar", "foo bar"],
      {
        uri: "http://test.elasticsearch.com/edge/_doc/_search",
        body: {
          _source: ["tailNodeId", "headNodeId", "score"],
          search_after: [0.10018775621583653, "bar", "foo bar"],
          size: 10,
          query: {
            bool: {
              must: [{ term: { tailNodeId: "react" } }]
            }
          },
          sort: [{ score: "desc" }, { headNodeId: "asc" }, { _id: "asc" }]
        }
      }
    ]
  ])(
    "should map params %o %s %o to request %o",
    (tailNodeId, size, cursor, expected) => {
      const actual = edgesSearcher.createRequest(tailNodeId, size, cursor);
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
                _id: "foo bar",
                _score: null,
                _source: {
                  score: 0.10018775621583653,
                  tailNodeId: "foo",
                  headNodeId: "bar"
                },
                sort: [0.10018775621583653, "bar", "foo bar"]
              }
            ]
          }
        }
      },
      10,
      {
        edges: [
          {
            id: "foo bar",
            tailNodeId: "foo",
            headNodeId: "bar",
            score: 0.10018775621583653,
            cursor: [0.10018775621583653, "bar", "foo bar"]
          }
        ],
        hasMore: false
      }
    ]
  ])(
    "should map response %o with size %o to %o",
    (response, size, expected) => {
      const actual = edgesSearcher.mapResponse(response, size);
      expect(actual).toEqual(expected);
    }
  );
});
