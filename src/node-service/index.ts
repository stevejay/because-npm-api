import _ from "lodash";
import * as searcher from "../searcher";
import { ParsedTweetTextResult, ReferencedNodes } from "../types/custom";
import * as mapper from "./mapper";
import * as npmSearcher from "./npm-searcher";

export async function findReferencedNodes(
  parsedTweetResult: ParsedTweetTextResult
): Promise<ReferencedNodes | null> {
  const ids = [parsedTweetResult.tailNodeId, parsedTweetResult.headNodeId];
  const getNodesResult = await searcher.getNodes({ ids });
  const indexedNodes = mapper.mapGetNodesResultToNodes(getNodesResult);
  const unindexedNodes = await npmSearcher.getUnindexedNodes(ids, indexedNodes);
  return mapper.mapNodeInfoToFindReferencedNodesResult(
    parsedTweetResult,
    indexedNodes,
    unindexedNodes
  );
}
