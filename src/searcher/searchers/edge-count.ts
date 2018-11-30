import _ from "lodash";
import { EDGE_SEARCH_INDEX_BASE_URI, MSEARCH_BASE_URI } from "../../constants";
import {
  EdgeCountByNodeSearchResult,
  GotNDJSONRequest,
  GotRequest
} from "../../types/custom";

export function createMultiRequest(nodeIds: string[]): GotNDJSONRequest {
  const jsonList: object[] = [];

  nodeIds.forEach(id => {
    jsonList.push({ index: "edge" });
    jsonList.push(createQuery(id));
  });

  return {
    uri: MSEARCH_BASE_URI,
    jsonList
  };
}

export function createRequest(nodeId: string): GotRequest {
  const uri = `${EDGE_SEARCH_INDEX_BASE_URI}/_doc/_search`;
  const body = createQuery(nodeId);
  return { uri, body };
}

export function mapMultiResponse(response: any): EdgeCountByNodeSearchResult[] {
  return JSON.parse(response.body).responses.map((element: any) => ({
    count: element.hits.total,
    moreMayExist: !!element.terminated_early
  }));
}

export function mapResponse(response: any): EdgeCountByNodeSearchResult {
  return {
    count: response.body.hits.total,
    moreMayExist: !!response.body.terminated_early
  };
}

function createQuery(nodeId: string): object {
  return {
    terminate_after: 100,
    size: 0,
    query: {
      bool: {
        should: [
          { term: { tailNodeId: nodeId } },
          { term: { headNodeId: nodeId } }
        ],
        minimum_should_match: 1
      }
    }
  };
}
