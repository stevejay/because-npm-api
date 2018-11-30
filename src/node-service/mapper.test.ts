import * as mapper from "./mapper";

const INDEXED_REACT_NODE = {
  id: "react",
  link: "//react",
  score: 0,
  isNew: false
};

const UNINDEXED_REACT_NODE = {
  id: "react",
  link: "//react",
  score: 0,
  isNew: true
};

const INDEXED_REDUX_NODE = {
  id: "redux",
  link: "//redux",
  score: 1,
  isNew: false
};

const UNINDEXED_REDUX_NODE = {
  id: "redux",
  link: "//redux",
  score: 1,
  isNew: true
};

describe("mapGetNodesResultToNodes", () => {
  it("should map", () => {
    const getNodesResult = {
      nodes: [
        {
          id: "react",
          description: "some description",
          link: "//react",
          score: 0.5
        }
      ]
    };
    const actual = mapper.mapGetNodesResultToNodes(getNodesResult);
    expect(actual).toEqual([
      {
        id: "react",
        description: "some description",
        link: "//react",
        score: 0.5,
        isNew: false
      }
    ]);
  });
});

describe("mapNodeInfoToFindReferencedNodesResult", () => {
  test.each([
    [
      {
        comment: "some text",
        tailNodeId: "react",
        headNodeId: "redux"
      },
      [],
      [],
      null
    ],
    [
      {
        comment: "some text",
        tailNodeId: "react",
        headNodeId: "redux"
      },
      [],
      [UNINDEXED_REDUX_NODE],
      null
    ],
    [
      {
        comment: "some text",
        tailNodeId: "react",
        headNodeId: "redux"
      },
      [INDEXED_REACT_NODE],
      [],
      null
    ],
    [
      {
        comment: "some text",
        tailNodeId: "react",
        headNodeId: "redux"
      },
      [INDEXED_REACT_NODE],
      [UNINDEXED_REDUX_NODE],
      { tailNode: INDEXED_REACT_NODE, headNode: UNINDEXED_REDUX_NODE }
    ],
    [
      {
        comment: "some text",
        tailNodeId: "react",
        headNodeId: "redux"
      },
      [INDEXED_REDUX_NODE, INDEXED_REACT_NODE],
      [],
      { tailNode: INDEXED_REACT_NODE, headNode: INDEXED_REDUX_NODE }
    ],
    [
      {
        comment: "some text",
        tailNodeId: "react",
        headNodeId: "redux"
      },
      [],
      [UNINDEXED_REDUX_NODE, UNINDEXED_REACT_NODE],
      { tailNode: UNINDEXED_REACT_NODE, headNode: UNINDEXED_REDUX_NODE }
    ]
  ])(
    "should map tweet %o with indexed nodes %o and unindexed nodes %o to %o",
    (parsedTweetResult, indexedNodes, unindexedNodes, expected) => {
      const actual = mapper.mapNodeInfoToFindReferencedNodesResult(
        parsedTweetResult,
        indexedNodes,
        unindexedNodes
      );
      expect(actual).toEqual(expected);
    }
  );
});
