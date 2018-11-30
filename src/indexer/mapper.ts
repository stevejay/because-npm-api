import _ from "lodash";
import * as constants from "../constants";
import {
  Comment,
  ESBulkApiRequestPart,
  GotNDJSONRequest,
  GotRequest,
  Node
} from "../types/custom";
import * as edgeCommentIndexer from "./indexers/edge-comment-indexer";
import * as edgeIndexer from "./indexers/edge-indexer";
import * as nodeIndexer from "./indexers/node-indexer";

export function mapMultiIndexRequestForBulkApi(
  comment: Comment
): GotNDJSONRequest {
  const parts: ESBulkApiRequestPart[] = [];

  if (comment.tailNode.isNew) {
    const part = mapIndexNodeRequestForBulkApi(comment.tailNode);
    parts.push(part);
  }

  if (comment.headNode.isNew) {
    const part = mapIndexNodeRequestForBulkApi(comment.headNode);
    parts.push(part);
  }

  let part = mapIndexEdgeRequestForBulkApi(comment);
  parts.push(part);

  part = mapIndexEdgeCommentRequestForBulkApi(comment);
  parts.push(part);

  return {
    uri: constants.BULK_API_BASE_URI,
    jsonList: mapESBulkApiRequestPartsToList(parts)
  };
}

function mapESBulkApiRequestPartsToList(parts: ESBulkApiRequestPart[]) {
  return _.flatten(
    parts.map(part =>
      part.doc ? [part.actionAndMetadata, part.doc] : [part.actionAndMetadata]
    )
  );
}

export function mapIndexNodeRequest(node: Node): GotRequest {
  const uri = nodeIndexer.createDocumentUri(node);
  const doc = nodeIndexer.createDocument(node);
  return { uri, body: doc };
}

export function mapIndexNodeRequestForBulkApi(
  node: Node
): ESBulkApiRequestPart {
  const actionAndMetadata = {
    index: {
      _index: constants.NODE_SEARCH_INDEX_NAME,
      _type: "_doc",
      _id: nodeIndexer.createDocumentId(node)
    }
  };
  const doc = nodeIndexer.createDocument(node);
  return { actionAndMetadata, doc };
}

export function mapIndexEdgeRequest(comment: Comment): GotRequest {
  const uri = edgeIndexer.createDocumentUri(comment);
  const doc = edgeIndexer.createDocument(comment);
  return { uri, body: doc };
}

export function mapIndexEdgeRequestForBulkApi(
  comment: Comment
): ESBulkApiRequestPart {
  const actionAndMetadata = {
    index: {
      _index: constants.EDGE_SEARCH_INDEX_NAME,
      _type: "_doc",
      _id: edgeIndexer.createDocumentId(comment)
    }
  };
  const doc = edgeIndexer.createDocument(comment);
  return { actionAndMetadata, doc };
}

export function mapIndexEdgeCommentRequest(comment: Comment): GotRequest {
  const uri = edgeCommentIndexer.createDocumentUri(comment);
  const doc = edgeCommentIndexer.createDocument(comment);
  return { uri, body: doc };
}

export function mapIndexEdgeCommentRequestForBulkApi(
  comment: Comment
): ESBulkApiRequestPart {
  const actionAndMetadata = {
    index: {
      _index: constants.EDGE_COMMENT_SEARCH_INDEX_NAME,
      _type: "_doc",
      _id: edgeCommentIndexer.createDocumentId(comment)
    }
  };
  const doc = edgeCommentIndexer.createDocument(comment);
  return { actionAndMetadata, doc };
}
