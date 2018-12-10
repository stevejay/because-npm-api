import { GraphQLResolveInfo } from "graphql";
import { fieldsList } from "graphql-fields-list";
import _ from "lodash";
import {
  AutocompleteSearchForNodesRequest,
  AutocompleteSearchForNodesResult,
  GetNodeRequest,
  GetNodeResult,
  SearchForEdgesRequest,
  SearchForEdgesResult,
  SearchForEdgeCommentsRequest,
  SearchForEdgeCommentsResult,
  SearchForNodesRequest,
  SearchForNodesResult
} from "../types/custom";
import * as cursor from "./cursor";

export function mapGetNodeRequest(
  args: any,
  info: GraphQLResolveInfo
): GetNodeRequest {
  const fields = fieldsList(info, { path: "" });
  const includeEdgeCounts = _.includes(fields, "edgeCount");
  return { id: args.id, includeEdgeCounts };
}

export function mapGetNodeResult(result: GetNodeResult): any {
  return {
    id: result.node.id,
    link: result.node.link,
    description: result.node.description,
    edgeCount: _.isNil(result.node.edgeCount)
      ? undefined
      : result.node.edgeCount,
    score: result.node.score
  };
}

export function mapAutocompleteSearchForNodesRequest(
  args: any,
  info: GraphQLResolveInfo
): AutocompleteSearchForNodesRequest {
  const fields = fieldsList(info, { path: "nodes" });
  const includeEdgeCounts = _.includes(fields, "edgeCount");
  return {
    term: args.term,
    size: args.first || 10,
    includeEdgeCounts
  };
}

export function mapAutocompleteSearchForNodesResult(
  result: AutocompleteSearchForNodesResult
): any {
  return {
    nodes: result.nodes.map(node => ({
      id: node.id,
      link: node.link,
      description: node.description,
      edgeCount: _.isNil(node.edgeCount) ? undefined : node.edgeCount,
      score: node.score
    }))
  };
}

export function mapSearchForNodesRequest(
  args: any,
  info: GraphQLResolveInfo
): SearchForNodesRequest {
  const fields = fieldsList(info, { path: "edges.node" });
  const includeEdgeCounts = _.includes(fields, "edgeCount");
  return {
    term: args.term,
    size: args.first || 10,
    cursor: cursor.parse(args.after),
    includeEdgeCounts
  };
}

export function mapSearchForNodesResult(result: SearchForNodesResult): any {
  return {
    edges: result.nodes.map(node => ({
      node: {
        id: node.id,
        link: node.link,
        description: node.description,
        edgeCount: _.isNil(node.edgeCount) ? undefined : node.edgeCount,
        score: node.score
      },
      cursor: cursor.create(node.cursor)
    })),
    pageInfo: {
      hasNextPage: result.hasMore
    }
  };
}

export function mapSearchForEdgesRequest(args: any): SearchForEdgesRequest {
  return {
    tailNodeId: args.tailNodeId,
    size: args.first || 10,
    cursor: cursor.parse(args.after)
  };
}

export function mapSearchForEdgesResult(result: SearchForEdgesResult): any {
  return {
    edges: result.edges.map(edge => ({
      node: {
        id: edge.id,
        headNodeId: edge.headNodeId,
        tailNodeId: edge.tailNodeId,
        score: edge.score
      },
      cursor: cursor.create(edge.cursor)
    })),
    pageInfo: {
      hasNextPage: result.hasMore
    }
  };
}

export function mapSearchForEdgeCommentsRequest(
  args: any
): SearchForEdgeCommentsRequest {
  return {
    edgeId: args.edgeId,
    size: args.first || 10,
    cursor: cursor.parse(args.after)
  };
}

export function mapSearchForEdgeCommentsResult(
  result: SearchForEdgeCommentsResult
): any {
  return {
    edges: result.edgeComments.map(edgeComment => ({
      node: {
        id: edgeComment.id,
        edgeId: edgeComment.edgeId,
        comment: edgeComment.comment,
        sourceLink: edgeComment.sourceLink,
        sourceUserId: edgeComment.sourceUserId,
        timestampMs: `${edgeComment.timestampMs}` // TODO SJ find a better approach
      },
      cursor: cursor.create(edgeComment.cursor)
    })),
    pageInfo: {
      hasNextPage: result.hasMore
    }
  };
}
