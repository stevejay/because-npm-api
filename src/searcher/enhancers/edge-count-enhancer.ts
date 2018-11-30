import _ from "lodash";
import * as esWrapper from "../../library-wrappers/es-wrapper";
import { NodeSearchResult } from "../../types/custom";
import * as edgeCountByNodeSearcher from "../searchers/edge-count";

export async function enhanceMultiple(
  nodes: NodeSearchResult[]
): Promise<NodeSearchResult[]> {
  if (_.isEmpty(nodes)) {
    return nodes;
  }
  const ids = nodes.map(node => node.id);
  const request = edgeCountByNodeSearcher.createMultiRequest(ids);
  const response = await esWrapper.postNDJSON(request);
  const counts = edgeCountByNodeSearcher.mapMultiResponse(response);
  return nodes.map((node, index) => ({
    ...node,
    edgeCount: counts[index].count
  }));
}

export async function enhance(
  node: NodeSearchResult
): Promise<NodeSearchResult> {
  const request = edgeCountByNodeSearcher.createRequest(node.id);
  const response = await esWrapper.post(request);
  const count = edgeCountByNodeSearcher.mapResponse(response);
  return {
    ...node,
    edgeCount: count.count
  };
}
