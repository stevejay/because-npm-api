import got from "got";
import _ from "lodash";
import * as constants from "../../constants";
import {
  EdgeCommentSearchResult,
  GotRequest,
  SearchForEdgeCommentsResult
} from "../../types/custom";

// TODO support different sortings
export function createRequest(
  edgeId: string,
  size: number,
  cursor: any | null
): GotRequest {
  const uri = `${constants.EDGE_COMMENT_SEARCH_INDEX_BASE_URI}/_doc/_search`;
  const body = {
    _source: ["edgeId", "comment", "sourceLink", "sourceUserId", "timestampMs"],
    search_after: cursor || undefined,
    size,
    query: {
      bool: {
        must: [{ term: { edgeId } }]
      }
    },
    sort: [{ timestampMs: "desc" }, { _id: "asc" }]
  };
  return { uri, body };
}

export function mapResponse(
  response: got.Response<any>,
  size: number
): SearchForEdgeCommentsResult {
  const hits = response.body.hits ? response.body.hits.hits || [] : [];
  const hasMore = hits.length >= size;
  const edgeComments: EdgeCommentSearchResult[] = hits.map(
    (hit: any): EdgeCommentSearchResult => ({
      id: hit._id,
      edgeId: hit._source.edgeId,
      comment: hit._source.comment,
      sourceLink: hit._source.sourceLink,
      sourceUserId: hit._source.sourceUserId,
      timestampMs: hit._source.timestampMs,
      cursor: hit.sort
    })
  );
  return { edgeComments, hasMore };
}
