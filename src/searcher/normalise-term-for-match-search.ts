import _ from "lodash";

export default function normaliseTermForMatchSearch(term: string) {
  const parts = _.split(
    (term || "").toLowerCase().replace("@", " "),
    /[\/_-\s]/g
  )
    .map(part => part.trim())
    .filter(part => !!part);
  return parts.join(" ");
}
