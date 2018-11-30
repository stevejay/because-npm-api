import got from "got";
import _ from "lodash";
import * as constants from "../../constants";
import {
  GetNodesRequest,
  GetNodesResult,
  GotRequest,
  Node
} from "../../types/custom";

export function createRequest(args: GetNodesRequest): GotRequest {
  const uri = `${constants.NODE_SEARCH_INDEX_BASE_URI}/_doc/_mget`;
  const body = { ids: args.ids };
  return { uri, body };
}

export function mapResponse(response: got.Response<any>): GetNodesResult {
  if (_.isEmpty(response.body.docs)) {
    return { nodes: [] };
  }
  const nodes = response.body.docs
    .filter((doc: any) => !!doc.found)
    .map(
      (doc: any): Node => ({
        id: doc._id,
        description: doc._source.description || null,
        link: doc._source.link,
        score: doc._source.score,
        isNew: false
      })
    );
  return { nodes };
}
