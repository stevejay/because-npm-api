import * as nodesSearcher from "./nodes";

describe("createRequest", () => {
  it("should create a valid request", () => {
    const actual = nodesSearcher.createRequest("FOOBAR", 10, [1, 2, 3]);
    expect(actual).toEqual({
      uri: "http://test.elasticsearch.com/node/_doc/_search",
      body: {
        _source: ["description", "link", "score", "idMatchQueryText"],
        search_after: [1, 2, 3],
        size: 10,
        query: {
          bool: {
            should: [
              {
                match: {
                  idMatchQueryText: {
                    query: "foobar",
                    operator: "or",
                    fuzziness: "AUTO"
                  }
                }
              },
              {
                prefix: {
                  idMatchQueryText: { value: "foobar", boost: 0.5 }
                }
              }
            ],
            minimum_should_match: 1
          }
        },
        sort: [{ _score: "desc" }, { score: "desc" }, { _id: "asc" }]
      }
    });
  });
});

describe("mapResponse", () => {
  test.each([
    [
      {
        body: {}
      },
      { nodes: [], hasMore: false }
    ],
    [
      {
        body: {
          hits: {
            total: 7,
            max_score: null,
            hits: [
              {
                _id: "foo",
                _score: 2.6561656,
                _source: {
                  score: 0.0797457287690511,
                  idMatchQueryText: "foo foo",
                  link: "https://www.npmjs.com/package/foo",
                  description: "An opinionated git cli for oss"
                },
                sort: [2.6561656, "foo"]
              }
            ]
          }
        }
      },
      {
        nodes: [
          {
            id: "foo",
            score: 0.0797457287690511,
            link: "https://www.npmjs.com/package/foo",
            description: "An opinionated git cli for oss",
            idMatchQueryText: "foo foo",
            cursor: [2.6561656, "foo"]
          }
        ],
        hasMore: false
      }
    ]
  ])("should parse response %o as %o", (response, expected) => {
    const actual = nodesSearcher.mapResponse(response, 10);
    expect(actual).toEqual(expected);
  });
});
