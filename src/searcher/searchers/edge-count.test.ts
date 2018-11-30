import * as edgeCountSearcher from "./edge-count";

describe("createMultiRequest", () => {
  test.each([
    [
      ["recompose", "react"],
      {
        uri: "http://test.elasticsearch.com/_msearch",
        jsonList: [
          { index: "edge" },
          {
            terminate_after: 100,
            size: 0,
            query: {
              bool: {
                should: [
                  { term: { tailNodeId: "recompose" } },
                  { term: { headNodeId: "recompose" } }
                ],
                minimum_should_match: 1
              }
            }
          },
          { index: "edge" },
          {
            terminate_after: 100,
            size: 0,
            query: {
              bool: {
                should: [
                  { term: { tailNodeId: "react" } },
                  { term: { headNodeId: "react" } }
                ],
                minimum_should_match: 1
              }
            }
          }
        ]
      }
    ]
  ])("should map tail node ids %o to request %o", (tailNodeIds, expected) => {
    const actual = edgeCountSearcher.createMultiRequest(tailNodeIds);
    expect(actual).toEqual(expected);
  });
});

describe("createRequest", () => {
  test.each([
    [
      "recompose",
      {
        uri: "http://test.elasticsearch.com/edge/_doc/_search",
        body: {
          terminate_after: 100,
          size: 0,
          query: {
            bool: {
              should: [
                { term: { tailNodeId: "recompose" } },
                { term: { headNodeId: "recompose" } }
              ],
              minimum_should_match: 1
            }
          }
        }
      }
    ]
  ])("should map tail node ids %o to request %o", (tailNodeIds, expected) => {
    const actual = edgeCountSearcher.createRequest(tailNodeIds);
    expect(actual).toEqual(expected);
  });
});

describe("mapMultiResponse", () => {
  test.each([
    [
      {
        body: JSON.stringify({
          responses: [
            {
              took: 0,
              timed_out: false,
              _shards: {
                total: 1,
                successful: 1,
                skipped: 0,
                failed: 0
              },
              hits: {
                total: 1,
                max_score: 0,
                hits: []
              },
              status: 200
            },
            {
              took: 0,
              timed_out: false,
              terminated_early: true,
              _shards: {
                total: 1,
                successful: 1,
                skipped: 0,
                failed: 0
              },
              hits: {
                total: 100,
                max_score: 0,
                hits: []
              },
              status: 200
            }
          ]
        })
      },
      [{ count: 1, moreMayExist: false }, { count: 100, moreMayExist: true }]
    ]
  ])("should map response %o to %o", (response, expected) => {
    const actual = edgeCountSearcher.mapMultiResponse(response);
    expect(actual).toEqual(expected);
  });
});

describe("mapResponse", () => {
  test.each([
    [
      {
        body: {
          took: 0,
          timed_out: false,
          _shards: {
            total: 1,
            successful: 1,
            skipped: 0,
            failed: 0
          },
          hits: {
            total: 5,
            max_score: 0,
            hits: []
          },
          status: 200
        }
      },
      { count: 5, moreMayExist: false }
    ]
  ])("should map response %o to %o", (response, expected) => {
    const actual = edgeCountSearcher.mapResponse(response);
    expect(actual).toEqual(expected);
  });
});
