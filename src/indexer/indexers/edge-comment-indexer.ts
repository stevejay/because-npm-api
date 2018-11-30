import _ from "lodash";
import * as constants from "../../constants";
import { Comment } from "../../types/custom";
import * as edgeIndexer from "./edge-indexer";

export function createDocumentId(comment: Comment): string {
  return comment.id;
}

export function createDocumentUri(comment: Comment): string {
  return `${
    constants.EDGE_COMMENT_SEARCH_INDEX_BASE_URI
  }/_doc/${encodeURIComponent(createDocumentId(comment))}`;
}

export function createDocument(comment: Comment): object {
  return {
    edgeId: edgeIndexer.createDocumentId(comment),
    comment: comment.comment,
    sourceLink: comment.sourceLink,
    sourceUserId: comment.sourceUserId,
    timestampMs: comment.timestampMs
  };
}
