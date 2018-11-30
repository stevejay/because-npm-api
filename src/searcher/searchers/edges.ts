import got from "got";
import _ from "lodash";
import * as constants from "../../constants";
import {
  EdgeSearchResult,
  GotRequest,
  SearchForEdgesResult
} from "../../types/custom";

// TODO support different sortings
export function createRequest(
  tailNodeId: string,
  size: number,
  cursor: any | null
): GotRequest {
  const uri = `${constants.EDGE_SEARCH_INDEX_BASE_URI}/_doc/_search`;
  const body = {
    _source: ["tailNodeId", "headNodeId", "score"],
    search_after: cursor || undefined,
    size,
    query: {
      bool: {
        must: [{ term: { tailNodeId } }]
      }
    },
    sort: [{ score: "desc" }, { headNodeId: "asc" }, { _id: "asc" }]
  };
  return { uri, body };
}

export function mapResponse(
  response: got.Response<any>,
  size: number
): SearchForEdgesResult {
  const hits = response.body.hits ? response.body.hits.hits || [] : [];
  const hasMore = hits.length >= size;

  const edges: EdgeSearchResult[] = hits.map(
    (hit: any): EdgeSearchResult => ({
      id: hit._id,
      tailNodeId: hit._source.tailNodeId,
      headNodeId: hit._source.headNodeId,
      score: hit._source.score,
      cursor: hit.sort
    })
  );

  return { edges, hasMore };
}
