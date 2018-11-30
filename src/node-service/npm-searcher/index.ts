import _ from "lodash";
import * as npmFetch from "../../library-wrappers/npm-fetch-wrapper";
import { Node, NodeSearchResult } from "../../types/custom";
import notNil from "../../types/not-nil";
import * as mapper from "./mapper";

const MAX_SEARCH_RESULTS = 3;

export async function getUnindexedNodes(
  ids: string[],
  indexedNodes: NodeSearchResult[]
): Promise<Node[]> {
  const nodesToFind = _.difference(ids, indexedNodes.map(node => node.id));
  return _.isEmpty(nodesToFind) ? [] : await searchForPackagesById(nodesToFind);
}

async function searchForPackagesById(ids: string[]): Promise<Node[]> {
  const nodes = await Promise.all(
    ids.map(async id => {
      const response = await npmFetch.search(id, MAX_SEARCH_RESULTS);
      return mapper.mapSearchResponse(response, id);
    })
  );
  return nodes.filter(notNil);
}
