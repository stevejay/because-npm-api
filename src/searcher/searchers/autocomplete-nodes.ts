import got from "got";
import _ from "lodash";
import * as constants from "../../constants";
import {
  AutocompleteSearchForNodesRequest,
  AutocompleteSearchForNodesResult,
  GotRequest,
  NodeSearchResult
} from "../../types/custom";
import normaliseTermForSuggestionSearch from "../normalise-term-for-suggestion-search";

export function createRequest(
  args: AutocompleteSearchForNodesRequest
): GotRequest {
  const cleanedTerm = normaliseTermForSuggestionSearch(args.term);
  const uri = `${constants.NODE_SEARCH_INDEX_BASE_URI}/_doc/_search`;
  const body = {
    _source: ["description", "link", "score", "idMatchQueryText"],
    suggest: {
      nodeSuggest: {
        prefix: cleanedTerm,
        completion: {
          field: "suggest",
          size: args.size
        }
      },
      nodeSuggestFuzzy: {
        prefix: cleanedTerm,
        completion: {
          field: "suggest",
          fuzzy: true,
          size: args.size
        }
      }
    }
  };
  return { uri, body };
}

export function mapResponse(
  response: got.Response<any>,
  size: number
): AutocompleteSearchForNodesResult {
  const suggestions = response.body.suggest
    ? response.body.suggest.nodeSuggest || []
    : [];
  const searchTerm = _.isEmpty(suggestions) ? "" : suggestions[0].text;
  const regularOptions = _.isEmpty(suggestions) ? [] : suggestions[0].options;
  const fuzzySuggestions = response.body.suggest
    ? response.body.suggest.nodeSuggestFuzzy || []
    : [];
  const fuzzyOptions = _.isEmpty(fuzzySuggestions)
    ? []
    : fuzzySuggestions[0].options;
  const options: any[] = _.unionBy(regularOptions, fuzzyOptions, "_id");
  let nodes = options.map(
    (option): NodeSearchResult => ({
      id: option._id,
      description: option._source.description,
      link: option._source.link,
      score: option._source.score,
      idMatchQueryText: option._source.idMatchQueryText
    })
  );
  if (searchTerm) {
    // Bump exact matches to the top of the list:
    nodes = [
      ...nodes.filter(node => node.id === searchTerm),
      ...nodes.filter(node => node.id !== searchTerm)
    ];
  }
  return { nodes: _.take(nodes, size) };
}
