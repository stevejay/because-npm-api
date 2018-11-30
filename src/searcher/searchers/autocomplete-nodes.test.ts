import * as autocompleteNodesSearcher from "./autocomplete-nodes";

describe("createRequest", () => {
  it("should create a valid request", () => {
    const actual = autocompleteNodesSearcher.createRequest({
      term: "foo-bar",
      size: 10,
      includeEdgeCounts: false
    });
    expect(actual).toEqual({
      uri: "http://test.elasticsearch.com/node/_doc/_search",
      body: {
        _source: ["description", "link", "score", "idMatchQueryText"],
        suggest: {
          nodeSuggest: {
            prefix: "foobar",
            completion: {
              field: "suggest",
              size: 10
            }
          },
          nodeSuggestFuzzy: {
            prefix: "foobar",
            completion: {
              field: "suggest",
              fuzzy: true,
              size: 10
            }
          }
        }
      }
    });
  });
});

describe("mapResponse", () => {
  test.each([
    [
      {
        body: {
          suggest: {
            nodeSuggest: [
              {
                text: "foo",
                options: []
              }
            ],
            nodeSuggestFuzzy: [
              {
                text: "foo",
                options: []
              }
            ]
          }
        }
      },
      { nodes: [] }
    ],
    [
      {
        body: {
          suggest: {
            nodeSuggest: [
              {
                text: "foo",
                options: [
                  {
                    _id: "foo",
                    _score: 100,
                    _source: {
                      score: 0.0797457287690511,
                      link: "https://www.npmjs.com/package/foo",
                      description: "An opinionated git cli for oss",
                      idMatchQueryText: "foo foo"
                    }
                  }
                ]
              }
            ],
            nodeSuggestFuzzy: [
              {
                text: "foo",
                options: [
                  {
                    _id: "foo",
                    _score: 200,
                    _source: {
                      score: 0.0797457287690511,
                      link: "https://www.npmjs.com/package/foo",
                      description: "An opinionated git cli for oss",
                      idMatchQueryText: "foo foo"
                    }
                  }
                ]
              }
            ]
          }
        }
      },
      {
        nodes: [
          {
            id: "foo",
            link: "https://www.npmjs.com/package/foo",
            description: "An opinionated git cli for oss",
            score: 0.0797457287690511,
            idMatchQueryText: "foo foo"
          }
        ]
      }
    ],
    [
      {
        body: {
          suggest: {
            nodeSuggest: [
              {
                text: "foobar",
                options: [
                  {
                    _id: "foo",
                    _score: 100,
                    _source: {
                      score: 0.0797457287690511,
                      link: "https://www.npmjs.com/package/foo",
                      description: "An opinionated git cli for oss",
                      idMatchQueryText: "foo"
                    }
                  },
                  {
                    _id: "foobar",
                    _score: 100,
                    _source: {
                      score: 0.0797457287690511,
                      link: "https://www.npmjs.com/package/foobar",
                      description: "An opinionated git cli for oss",
                      idMatchQueryText: "foobar"
                    }
                  }
                ]
              }
            ],
            nodeSuggestFuzzy: [
              {
                options: []
              }
            ]
          }
        }
      },
      {
        nodes: [
          {
            id: "foobar",
            link: "https://www.npmjs.com/package/foobar",
            description: "An opinionated git cli for oss",
            score: 0.0797457287690511,
            idMatchQueryText: "foobar"
          },
          {
            id: "foo",
            link: "https://www.npmjs.com/package/foo",
            description: "An opinionated git cli for oss",
            score: 0.0797457287690511,
            idMatchQueryText: "foo"
          }
        ]
      }
    ]
  ])("should parse response %o as %o", (response, expected) => {
    const actual = autocompleteNodesSearcher.mapResponse(response, 10);
    expect(actual).toEqual(expected);
  });
});
