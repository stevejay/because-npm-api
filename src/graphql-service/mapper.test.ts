import { GraphQLResolveInfo } from "graphql";
import * as mapper from "./mapper";

describe("mapGetNodeRequest", () => {
  it("should map", () => {
    const args = { id: "react" };
    const actual = mapper.mapGetNodeRequest(args, {} as GraphQLResolveInfo);
    expect(actual).toEqual({ id: "react", includeEdgeCounts: false });
  });
});

describe("mapGetNodeResult", () => {
  it("should map", () => {
    const result = {
      node: {
        id: "react",
        link: "http://foo.com",
        description: "foo",
        score: 1,
        isNew: false
      }
    };
    const actual = mapper.mapGetNodeResult(result);
    expect(actual).toEqual({
      node: {
        id: "react",
        link: "http://foo.com",
        description: "foo",
        score: 1
      }
    });
  });
});

describe("mapAutocompleteSearchForNodesRequest", () => {
  it("should map", () => {
    const args = {
      term: "react",
      first: 15
    };
    const actual = mapper.mapAutocompleteSearchForNodesRequest(
      args,
      {} as GraphQLResolveInfo
    );
    expect(actual).toEqual({
      term: "react",
      size: 15,
      includeEdgeCounts: false
    });
  });
});

describe("mapAutocompleteSearchForNodesResult", () => {
  it("should map with no edge count", () => {
    const result = {
      nodes: [
        {
          id: "react",
          link: "http://foo.com",
          description: "foo",
          score: 0.5,
          idMatchQueryText: "react"
        }
      ]
    };
    const actual = mapper.mapAutocompleteSearchForNodesResult(result);
    expect(actual).toEqual({
      nodes: [
        {
          id: "react",
          link: "http://foo.com",
          description: "foo",
          score: 0.5
        }
      ]
    });
  });
});

describe("mapSearchForNodesRequest", () => {
  it("should map", () => {
    const args = {
      term: "react",
      first: 15,
      after: "WzAuMTIsImZvbyIsImJhciJd"
    };
    const actual = mapper.mapSearchForNodesRequest(
      args,
      {} as GraphQLResolveInfo
    );
    expect(actual).toEqual({
      term: "react",
      size: 15,
      cursor: [0.12, "foo", "bar"],
      includeEdgeCounts: false
    });
  });
});

describe("mapSearchForNodesResult", () => {
  it("should map with no edge counts", () => {
    const result = {
      nodes: [
        {
          id: "a",
          link: "http://foo.com",
          description: "some description",
          score: 0.5,
          cursor: [0.12, "foo", "bar"]
        }
      ],
      hasMore: true
    };
    const actual = mapper.mapSearchForNodesResult(result);
    expect(actual).toEqual({
      edges: [
        {
          node: {
            id: "a",
            link: "http://foo.com",
            description: "some description",
            score: 0.5
          },
          cursor: "WzAuMTIsImZvbyIsImJhciJd"
        }
      ],
      pageInfo: {
        hasNextPage: true
      }
    });
  });

  it("should map with edge counts", () => {
    const result = {
      nodes: [
        {
          id: "a",
          link: "http://foo.com",
          description: "some description",
          score: 0.5,
          cursor: [0.12, "foo", "bar"],
          edgeCount: 50
        }
      ],
      hasMore: false
    };
    const actual = mapper.mapSearchForNodesResult(result);
    expect(actual).toEqual({
      edges: [
        {
          node: {
            id: "a",
            link: "http://foo.com",
            description: "some description",
            edgeCount: 50,
            score: 0.5
          },
          cursor: "WzAuMTIsImZvbyIsImJhciJd"
        }
      ],
      pageInfo: {
        hasNextPage: false
      }
    });
  });
});

describe("mapSearchForEdgesRequest", () => {
  it("should map", () => {
    const args = {
      tailNodeId: "react",
      first: 15,
      after: "WzAuMTIsImZvbyIsImJhciJd"
    };
    const actual = mapper.mapSearchForEdgesRequest(args);
    expect(actual).toEqual({
      tailNodeId: "react",
      size: 15,
      cursor: [0.12, "foo", "bar"]
    });
  });
});

describe("mapSearchForEdgesResult", () => {
  it("should map", () => {
    const result = {
      edges: [
        {
          id: "a b",
          headNodeId: "a",
          tailNodeId: "b",
          score: 0.5,
          cursor: [0.12, "foo", "bar"]
        }
      ],
      hasMore: true
    };
    const actual = mapper.mapSearchForEdgesResult(result);
    expect(actual).toEqual({
      edges: [
        {
          node: {
            id: "a b",
            headNodeId: "a",
            tailNodeId: "b",
            score: 0.5
          },
          cursor: "WzAuMTIsImZvbyIsImJhciJd"
        }
      ],
      pageInfo: {
        hasNextPage: true
      }
    });
  });
});

describe("mapSearchForEdgeCommentsRequest", () => {
  it("should map", () => {
    const args = {
      edgeId: "a b",
      first: 12,
      after: "WzAuMTIsImZvbyIsImJhciJd"
    };
    const actual = mapper.mapSearchForEdgeCommentsRequest(args);
    expect(actual).toEqual({
      edgeId: "a b",
      size: 12,
      cursor: [0.12, "foo", "bar"]
    });
  });
});

describe("mapSearchForEdgeCommentsResult", () => {
  it("should map", () => {
    const result = {
      edgeComments: [
        {
          id: "12345678",
          edgeId: "a b",
          comment: "some comment",
          sourceLink: "http://foo.com",
          sourceUserId: "2222222",
          timestampMs: 4444444,
          cursor: [0.12, "foo", "bar"]
        }
      ],
      hasMore: false
    };
    const actual = mapper.mapSearchForEdgeCommentsResult(result);
    expect(actual).toEqual({
      edges: [
        {
          node: {
            id: "12345678",
            edgeId: "a b",
            comment: "some comment",
            sourceLink: "http://foo.com",
            sourceUserId: "2222222",
            timestampMs: "4444444"
          },
          cursor: "WzAuMTIsImZvbyIsImJhciJd"
        }
      ],
      pageInfo: {
        hasNextPage: false
      }
    });
  });
});
