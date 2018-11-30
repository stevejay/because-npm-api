import * as esWrapper from "../library-wrappers/es-wrapper";
import {
  AutocompleteSearchForNodesRequest,
  AutocompleteSearchForNodesResult,
  GetNodesRequest,
  GetNodesResult,
  GetNodeRequest,
  GetNodeResult,
  SearchForEdgesRequest,
  SearchForEdgesResult,
  SearchForEdgeCommentsRequest,
  SearchForEdgeCommentsResult,
  SearchForNodesRequest,
  SearchForNodesResult
} from "../types/custom";
import * as edgeCountEnhancer from "./enhancers/edge-count-enhancer";
import * as nodeGetter from "./getters/node";
import * as nodesGetter from "./getters/nodes";
import * as autocompleteNodeSearcher from "./searchers/autocomplete-nodes";
import * as edgeCommentsByEdgeSearcher from "./searchers/edge-comments";
import * as edgesSearcher from "./searchers/edges";
import * as nodesSearcher from "./searchers/nodes";

export async function getNodes(args: GetNodesRequest): Promise<GetNodesResult> {
  const request = nodesGetter.createRequest(args);
  const response = await esWrapper.post(request);
  return nodesGetter.mapResponse(response);
}

export async function getNode(args: GetNodeRequest): Promise<GetNodeResult> {
  const request = nodeGetter.createRequest(args);
  const response = await esWrapper.get(request);
  const result = nodeGetter.mapResponse(response);
  if (args.includeEdgeCounts && result.node) {
    result.node = await edgeCountEnhancer.enhance(result.node);
  }
  return result;
}

export async function autocompleteSearchForNodes(
  args: AutocompleteSearchForNodesRequest
): Promise<AutocompleteSearchForNodesResult> {
  const request = autocompleteNodeSearcher.createRequest(args);
  const response = await esWrapper.post(request);
  const result = autocompleteNodeSearcher.mapResponse(response, args.size);
  if (args.includeEdgeCounts) {
    result.nodes = await edgeCountEnhancer.enhanceMultiple(result.nodes);
  }
  return result;
}

export async function searchForNodes(
  args: SearchForNodesRequest
): Promise<SearchForNodesResult> {
  const request = nodesSearcher.createRequest(
    args.term,
    args.size,
    args.cursor
  );
  const response = await esWrapper.post(request);
  const result = nodesSearcher.mapResponse(response, args.size);
  if (args.includeEdgeCounts) {
    result.nodes = await edgeCountEnhancer.enhanceMultiple(result.nodes);
  }
  return result;
}

export async function searchForEdges(
  args: SearchForEdgesRequest
): Promise<SearchForEdgesResult> {
  const request = edgesSearcher.createRequest(
    args.tailNodeId,
    args.size,
    args.cursor
  );
  const response = await esWrapper.post(request);
  return edgesSearcher.mapResponse(response, args.size);
}

export async function searchForEdgeComments(
  args: SearchForEdgeCommentsRequest
): Promise<SearchForEdgeCommentsResult> {
  const request = edgeCommentsByEdgeSearcher.createRequest(
    args.edgeId,
    args.size,
    args.cursor
  );
  const response = await esWrapper.post(request);
  return edgeCommentsByEdgeSearcher.mapResponse(response, args.size);
}
