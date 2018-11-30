import _ from "lodash";

export default function createBucketKey(id: string): string {
  return `${id.substring(0, 2)}/${id.substring(2, 4)}/${id}`;
}
