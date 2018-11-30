import _ from "lodash";
import * as constants from "../../constants";
import { Comment } from "../../types/custom";

export function createDocumentId(comment: Comment): string {
  return `${comment.tailNode.id} ${comment.headNode.id}`;
}

export function createDocumentUri(comment: Comment): string {
  return `${constants.EDGE_SEARCH_INDEX_BASE_URI}/_doc/${encodeURIComponent(
    createDocumentId(comment)
  )}`;
}

export function createDocument(comment: Comment): object {
  return {
    tailNodeId: comment.tailNode.id,
    headNodeId: comment.headNode.id,
    score: comment.headNode.score
  };
}
