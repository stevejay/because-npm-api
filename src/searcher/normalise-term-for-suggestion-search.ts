import _ from "lodash";

const NON_BASIC_ALPHANUM_REGEX = /[^a-z0-9]/g;

export default function normaliseTermForSuggestionSearch(
  term: string | null
): string {
  let normalised = (term || "").trim().toLowerCase();
  const isScopedName = normalised.length && normalised[0] === "@";
  normalised = normalised.replace(NON_BASIC_ALPHANUM_REGEX, "");
  return isScopedName ? `@${normalised}` : normalised;
}
