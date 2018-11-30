import { truncate } from "lodash";
import {
  Node,
  NpmRegistrySearchObject,
  NpmRegistrySearchResponse
} from "../../types/custom";

export function mapSearchResponse(
  response: NpmRegistrySearchResponse,
  id: string
): Node | null {
  const searchObj = getSearchObjectById(response, id);
  if (!searchObj) {
    return null;
  }

  const description = searchObj.package.description;
  return {
    id,
    description: description
      ? truncate(description, { length: 512, separator: " " })
      : null,
    link: searchObj.package.links.npm,
    score: searchObj.score.detail.popularity || 0,
    isNew: true
  };
}

function getSearchObjectById(
  response: NpmRegistrySearchResponse,
  id: string
): NpmRegistrySearchObject | undefined {
  return (response.objects || []).find(obj => obj.package.name === id);
}
