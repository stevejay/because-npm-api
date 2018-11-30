export const NODE_SEARCH_INDEX_NAME = "node";
export const EDGE_SEARCH_INDEX_NAME = "edge";
export const EDGE_COMMENT_SEARCH_INDEX_NAME = "edge-comment";

export const NODE_SEARCH_INDEX_BASE_URI = `${
  process.env.ELASTICSEARCH_URI
}${NODE_SEARCH_INDEX_NAME}`;

export const EDGE_SEARCH_INDEX_BASE_URI = `${
  process.env.ELASTICSEARCH_URI
}${EDGE_SEARCH_INDEX_NAME}`;

export const EDGE_COMMENT_SEARCH_INDEX_BASE_URI = `${
  process.env.ELASTICSEARCH_URI
}${EDGE_COMMENT_SEARCH_INDEX_NAME}`;

export const MSEARCH_BASE_URI = `${process.env.ELASTICSEARCH_URI}_msearch`;
export const BULK_API_BASE_URI = `${process.env.ELASTICSEARCH_URI}_bulk`;
