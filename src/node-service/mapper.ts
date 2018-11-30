import _ from "lodash";
import {
  GetNodesResult,
  Node,
  ParsedTweetTextResult,
  ReferencedNodes
} from "../types/custom";

export function mapNodeInfoToFindReferencedNodesResult(
  parsedTweetResult: ParsedTweetTextResult,
  indexedNodes: Node[],
  unindexedNodes: Node[]
): ReferencedNodes | null {
  const allNodes = _.concat(indexedNodes, unindexedNodes);
  const allNodesMap = _.keyBy(allNodes, node => node.id);
  const tailNode = allNodesMap[parsedTweetResult.tailNodeId] || null;
  const headNode = allNodesMap[parsedTweetResult.headNodeId] || null;
  return tailNode && headNode ? { tailNode, headNode } : null;
}

export function mapGetNodesResultToNodes(result: GetNodesResult): Node[] {
  return result.nodes.map(node => ({
    id: node.id,
    description: node.description,
    link: node.link,
    score: node.score,
    isNew: false
  }));
}
