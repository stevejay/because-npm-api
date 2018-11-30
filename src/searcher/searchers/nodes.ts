import got from "got";
import _ from "lodash";
import * as constants from "../../constants";
import {
  GotRequest,
  NodeSearchResult,
  SearchForNodesResult
} from "../../types/custom";
import normaliseTermForMatchSearch from "../normalise-term-for-match-search";

export function createRequest(
  term: string,
  size: number,
  cursor: any | null
): GotRequest {
  const cleanedTerm = normaliseTermForMatchSearch(term);
  const uri = `${constants.NODE_SEARCH_INDEX_BASE_URI}/_doc/_search`;
  const body = {
    _source: ["description", "link", "score", "idMatchQueryText"],
    search_after: cursor || undefined,
    size,
    query: {
      match: {
        idMatchQueryText: {
          query: cleanedTerm,
          operator: "or",
          fuzziness: "AUTO"
        }
      }
    },
    sort: [{ _score: "desc" }, { score: "desc" }, { _id: "asc" }]
  };
  return { uri, body };
}

export function mapResponse(
  response: got.Response<any>,
  size: number
): SearchForNodesResult {
  const hits = response.body.hits ? response.body.hits.hits || [] : [];
  const hasMore = hits.length >= size;

  const nodes: NodeSearchResult[] = hits.map(
    (hit: any): NodeSearchResult => ({
      id: hit._id,
      description: hit._source.description,
      link: hit._source.link,
      score: hit._source.score,
      idMatchQueryText: hit._source.idMatchQueryText,
      cursor: hit.sort
    })
  );

  return { nodes, hasMore };
}
