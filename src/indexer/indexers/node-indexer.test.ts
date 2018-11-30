import { Node } from "../../types/custom";
import * as nodeIndexer from "./node-indexer";

describe("createDocumentId", () => {
  it("should create the id", () => {
    const node = {
      id: "react-redux",
      link: "",
      description: "",
      score: 1,
      isNew: true
    };
    const actual = nodeIndexer.createDocumentId(node);
    expect(actual).toEqual("react-redux");
  });
});

describe("createDocumentUri", () => {
  test.each([
    [
      { id: "react-redux" },
      "http://test.elasticsearch.com/node/_doc/react-redux"
    ],
    [
      { id: "@foo-bar/react-redux" },
      "http://test.elasticsearch.com/node/_doc/%40foo-bar%2Freact-redux"
    ]
  ])("should take %o and return uri %s", (node: Node, expected: string) => {
    const actual = nodeIndexer.createDocumentUri(node);
    expect(actual).toEqual(expected);
  });
});

describe("createDocument", () => {
  test.each([
    [
      {
        id: "redux",
        description: "Some description",
        link: "https://www.npmjs.com/package/redux",
        score: 0.9,
        isNew: true
      },
      {
        idMatchQueryText: "redux",
        suggest: [{ input: ["redux"], weight: 100 }],
        description: "Some description",
        link: "https://www.npmjs.com/package/redux",
        score: 0.9
      }
    ],
    [
      {
        id: "react-redux",
        description: "Some description",
        link: "https://www.npmjs.com/package/redux",
        score: 0.9,
        isNew: true
      },
      {
        idMatchQueryText: "react redux reactredux",
        suggest: [
          { input: ["reactredux"], weight: 100 },
          { input: ["redux"], weight: 33 }
        ],
        description: "Some description",
        link: "https://www.npmjs.com/package/redux",
        score: 0.9
      }
    ],
    [
      {
        id: "@foo-bar/react-redux",
        description: "Some description",
        link: "https://www.npmjs.com/package/redux",
        score: 0.9,
        isNew: true
      },
      {
        idMatchQueryText: "foo bar react redux foobar reactredux",
        suggest: [
          { input: ["reactredux", "@foobarreactredux"], weight: 100 },
          { input: ["foobarreactredux"], weight: 66 },
          { input: ["redux"], weight: 33 }
        ],
        description: "Some description",
        link: "https://www.npmjs.com/package/redux",
        score: 0.9
      }
    ],
    [
      {
        id: "@foo-bar/react-redux",
        description: null,
        link: "https://www.npmjs.com/package/redux",
        score: 0.9,
        isNew: true
      },
      {
        idMatchQueryText: "foo bar react redux foobar reactredux",
        suggest: [
          { input: ["reactredux", "@foobarreactredux"], weight: 100 },
          { input: ["foobarreactredux"], weight: 66 },
          { input: ["redux"], weight: 33 }
        ],
        description: null,
        link: "https://www.npmjs.com/package/redux",
        score: 0.9
      }
    ],
    [
      {
        id: "@react-redux/react-redux",
        description: null,
        link: "https://www.npmjs.com/package/redux",
        score: 0.9,
        isNew: true
      },
      {
        idMatchQueryText: "react redux reactredux",
        suggest: [
          { input: ["reactredux", "@reactreduxreactredux"], weight: 100 },
          { input: ["reactreduxreactredux"], weight: 66 },
          { input: ["redux"], weight: 33 }
        ],
        description: null,
        link: "https://www.npmjs.com/package/redux",
        score: 0.9
      }
    ]
  ])("should take id $s and description $s and return $o", (node, expected) => {
    const actual = nodeIndexer.createDocument(node);
    expect(actual).toEqual(expected);
  });
});
