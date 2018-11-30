import _ from "lodash";
import * as constants from "../../constants";
import { Node, SuggestionField, WeightedSuggestion } from "../../types/custom";

export function createDocumentId(node: Node): string {
  return node.id;
}

export function createDocumentUri(node: Node): string {
  return `${constants.NODE_SEARCH_INDEX_BASE_URI}/_doc/${encodeURIComponent(
    createDocumentId(node)
  )}`;
}

export function createDocument(node: Node): object {
  const [scopeName, packageName] = getNodeIdParts(node.id);
  const processedScopeName = processPart(scopeName);
  const processedPackageName = processPart(packageName) || "";
  const suggest = createSuggestionField(
    processedScopeName,
    processedPackageName
  );
  const idMatchQueryText = createMatchQueryText(
    processedScopeName,
    processedPackageName
  );
  return {
    idMatchQueryText,
    suggest,
    description: node.description,
    link: node.link,
    score: node.score
  };
}

const NODE_ID_PARTS_REGEX = /^(@[^\/]+)\/(.+)$/;

function getNodeIdParts(nodeId: string) {
  const scopedMatches = nodeId.match(NODE_ID_PARTS_REGEX);
  if (!scopedMatches) {
    return [null, nodeId];
  }
  return [scopedMatches[1], scopedMatches[2]];
}

const HYPHENS_AND_UNDERSCORES_REGEX = /[-_]+/g;
const NON_BASIC_ALPHANUM_AND_WHITESPACE_REGEX = /[^\sa-z0-9]+/g;
const RUNS_OF_WHITESPACE_REGEX = /\s+/g;

function processPart(part: string | null): string | null {
  if (!part) {
    return null;
  }
  return part
    .replace(HYPHENS_AND_UNDERSCORES_REGEX, " ")
    .replace(NON_BASIC_ALPHANUM_AND_WHITESPACE_REGEX, "")
    .replace(RUNS_OF_WHITESPACE_REGEX, " ")
    .trim();
}

function createMatchQueryText(
  processedScopeName: string | null,
  processedPackageName: string
): string {
  const result: string[] = [];
  if (processedScopeName) {
    result.push(processedScopeName);
  }
  if (processedPackageName) {
    result.push(processedPackageName);
  }
  if (processedScopeName && processedScopeName.indexOf(" ") > -1) {
    result.push(processedScopeName.replace(RUNS_OF_WHITESPACE_REGEX, ""));
  }
  if (processedPackageName && processedPackageName.indexOf(" ") > -1) {
    result.push(processedPackageName.replace(RUNS_OF_WHITESPACE_REGEX, ""));
  }
  return _.uniq(result).join(" ");
}

const HIGH_WEIGHTING = 100;
const MEDIUM_WEIGHTING = 66;
const LOW_WEIGHTING = 33;

export default function createSuggestionField(
  processedScopeName: string | null,
  processedPackageName: string
): SuggestionField[] {
  const weightedSuggestions = createWeightedSuggestions(
    processedScopeName,
    processedPackageName
  );

  const result: SuggestionField[] = [];

  weightedSuggestions.forEach(weightedSuggestion => {
    let match = result.find(
      element => element.weight === weightedSuggestion.weight
    );
    if (!match) {
      match = { input: [], weight: weightedSuggestion.weight };
      result.push(match);
    }
    match.input.push(weightedSuggestion.value);
  });

  return result;
}

function createWeightedSuggestions(
  processedScopeName: string | null,
  processedPackageName: string
): WeightedSuggestion[] {
  const finalScopeName = processedScopeName
    ? processedScopeName.replace(RUNS_OF_WHITESPACE_REGEX, "")
    : null;

  const finalPackageName = processedPackageName.replace(
    RUNS_OF_WHITESPACE_REGEX,
    ""
  );

  const packageNameHasParts =
    processedPackageName.length > finalPackageName.length;

  const result: WeightedSuggestion[] = [];
  result.push({ value: finalPackageName, weight: HIGH_WEIGHTING });

  if (finalScopeName) {
    result.push({
      value: `@${finalScopeName}${finalPackageName}`,
      weight: HIGH_WEIGHTING
    });
    result.push({
      value: `${finalScopeName}${finalPackageName}`,
      weight: MEDIUM_WEIGHTING
    });
  }

  if (packageNameHasParts) {
    let subStr: string | null = processedPackageName;
    while (subStr) {
      const index = subStr.indexOf(" ");
      if (index > -1) {
        subStr = subStr.substring(index + 1);
        result.push({
          value: subStr.replace(RUNS_OF_WHITESPACE_REGEX, ""),
          weight: LOW_WEIGHTING
        });
      } else {
        subStr = null;
      }
    }
  }

  return result;
}
