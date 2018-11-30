import * as nodesGetter from "./nodes";

describe("createRequest", () => {
  test.each([
    [
      { ids: ["a", "b"] },
      {
        uri: "http://test.elasticsearch.com/node/_doc/_mget",
        body: { ids: ["a", "b"] }
      }
    ]
  ])("should map %o to %o", (args, expected) => {
    const actual = nodesGetter.createRequest(args);
    expect(actual).toEqual(expected);
  });
});

describe("mapResponse", () => {
  test.each([
    [{ body: { docs: [] } }, { nodes: [] }],
    [{ body: { docs: [{ found: false }] } }, { nodes: [] }],
    [
      {
        body: {
          docs: [
            {
              found: true,
              _id: "a",
              _source: {
                description: "some description",
                link: "some link",
                score: 0.5
              }
            }
          ]
        }
      },
      {
        nodes: [
          {
            id: "a",
            description: "some description",
            link: "some link",
            score: 0.5,
            isNew: false
          }
        ]
      }
    ]
  ])("should map %o to %o", (response, expected) => {
    const actual = nodesGetter.mapResponse(response);
    expect(actual).toEqual(expected);
  });
});
