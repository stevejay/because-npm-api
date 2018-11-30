import got from "got";
import _ from "lodash";
import * as constants from "../../constants";
import { GetNodeRequest, GetNodeResult, GotRequest } from "../../types/custom";

export function createRequest(args: GetNodeRequest): GotRequest {
  const uri = `${
    constants.NODE_SEARCH_INDEX_BASE_URI
  }/_doc/${encodeURIComponent(args.id)}`;
  return { uri };
}

export function mapResponse(response: got.Response<any>): GetNodeResult {
  if (!response.body.found) {
    throw new Error("[404] Not Found");
  }
  return {
    node: {
      id: response.body._id,
      description: response.body._source.description || null,
      link: response.body._source.link,
      score: response.body._source.score
    }
  };
}
