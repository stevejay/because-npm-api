import * as nodeGetter from "./node";

describe("createRequest", () => {
  test.each([
    [
      { id: "recompose" },
      { uri: "http://test.elasticsearch.com/node/_doc/recompose" }
    ],
    [
      { id: "@foo/recompose" },
      { uri: "http://test.elasticsearch.com/node/_doc/%40foo%2Frecompose" }
    ]
  ])("should map %o to %o", (args, expected) => {
    const actual = nodeGetter.createRequest(args);
    expect(actual).toEqual(expected);
  });
});

describe("mapResponse", () => {
  test.each([
    [
      {
        body: {
          found: true,
          _id: "a",
          _source: {
            description: "some description",
            link: "some link",
            score: 0.5
          }
        }
      },
      {
        node: {
          id: "a",
          description: "some description",
          link: "some link",
          score: 0.5
        }
      }
    ]
  ])("should map %o to %o", (response, expected) => {
    const actual = nodeGetter.mapResponse(response);
    expect(actual).toEqual(expected);
  });

  it("should throw when not found", () => {
    const response: any = { body: { found: false } };
    expect(() => nodeGetter.mapResponse(response)).toThrowError(/^\[404\]/);
  });
});
