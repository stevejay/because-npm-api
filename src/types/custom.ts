export interface HttpResponse {
  readonly statusCode: number;
  readonly body?: string;
}

// ----------------------------
// Twitter Webhook Types

export interface WarmUpAPIGatewayEvent extends AWSLambda.APIGatewayEvent {
  readonly source: string;
}

interface TweetCreateEventUser {
  readonly id_str: string;
  readonly screen_name: string;
}

export interface TweetCreateEventUserMention {
  readonly id_str: string;
}

interface TweetCreateEventEntities {
  readonly user_mentions: TweetCreateEventUserMention[];
}

interface ExtendedTweet {
  readonly full_text: string;
  readonly display_text_range: number[];
  readonly entities: TweetCreateEventEntities;
}

export interface Tweet {
  readonly id_str: string;
  readonly text?: string;
  readonly full_text?: string;
  readonly display_text_range?: number[];
  readonly truncated: boolean;
  readonly user: TweetCreateEventUser;
  readonly in_reply_to_status_id_str: string | null;
  readonly created_at: string;
  readonly entities: TweetCreateEventEntities;
  readonly retweeted_status?: object;
  readonly extended_tweet?: ExtendedTweet;
}

export interface TwitterWebhookMessage {
  readonly for_user_id: string;
  readonly tweet_create_events: Tweet[];
}

export interface TwitterWebhookRequest {
  readonly crcToken: string | null;
  readonly message: TwitterWebhookMessage | null;
}

export interface TweetCreated {
  readonly id: string;
  readonly text: string;
  readonly creatorId: string;
  readonly creatorUsername: string;
  readonly timestampMs: string;
}

export interface Message {
  readonly id: string;
  readonly json: any;
}

export interface TweetCreatedMessage extends Message {
  readonly json: TweetCreated;
}

export interface TweetCreatedSQSRequest {
  readonly messages: TweetCreated[];
}

export interface IngestTweetFromIdRequest {
  readonly id: string;
}

export interface ReindexTweetRequest {
  readonly id: string;
}

// ----------------------------
// Domain Types

export interface TweetValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ParsedTweet {
  readonly id: string;
  readonly text: string;
  readonly comment: string;
  readonly tailNodeId: string;
  readonly headNodeId: string;
  readonly creatorId: string;
  readonly creatorUsername: string;
  readonly timestampMs: string;
  readonly nodesNotFound: boolean;
}

export enum Source {
  Twitter = "twitter",
  App = "app"
}

export interface Node {
  readonly id: string;
  readonly description: string | null;
  readonly link: string;
  readonly score: number;
  readonly isNew: boolean;
}

export interface ParsedTweetTextResult {
  readonly comment: string;
  readonly tailNodeId: string;
  readonly headNodeId: string;
}

export interface ReferencedNodes {
  readonly tailNode: Node;
  readonly headNode: Node;
}

export interface Comment {
  readonly id: string;
  readonly comment: string;
  readonly source: Source;
  readonly sourceLink: string;
  readonly sourceUserId: string;
  readonly timestampMs: string;
  readonly tailNode: Node;
  readonly headNode: Node;
}

// ----------------------------
// ElasticSearch

export interface WeightedSuggestion {
  readonly value: string;
  readonly weight: number;
}

export interface SuggestionField {
  readonly input: string[];
  readonly weight: number;
}

export interface NodeSearchResult {
  readonly id: string;
  readonly description: string | null;
  readonly link: string;
  readonly edgeCount?: number;
  readonly score: number;
  readonly idMatchQueryText?: string;
  readonly cursor?: any;
}

export interface AutocompleteSearchForNodesRequest {
  readonly term: string;
  readonly size: number;
  readonly includeEdgeCounts: boolean;
}

export interface AutocompleteSearchForNodesResult {
  nodes: NodeSearchResult[];
}

export interface SearchForNodesRequest {
  readonly term: string;
  readonly size: number;
  readonly cursor: any;
  readonly includeEdgeCounts: boolean;
}

export interface SearchForNodesResult {
  nodes: NodeSearchResult[];
  readonly hasMore: boolean;
}

export interface GetNodeRequest {
  readonly id: string;
  readonly includeEdgeCounts: boolean;
}

export interface GetNodeResult {
  node: NodeSearchResult;
}

export interface GetNodesRequest {
  readonly ids: string[];
}

export interface GetNodesResult {
  readonly nodes: NodeSearchResult[];
}

export interface SearchForEdgesRequest {
  readonly tailNodeId: string;
  readonly size: number;
  readonly cursor: any;
}

export interface EdgeSearchResult {
  readonly id: string;
  readonly tailNodeId: string;
  readonly headNodeId: string;
  readonly score: number;
  readonly cursor: any;
}

export interface SearchForEdgesResult {
  readonly edges: EdgeSearchResult[];
  readonly hasMore: boolean;
}

export interface SearchForEdgeCommentsRequest {
  readonly edgeId: string;
  readonly size: number;
  readonly cursor: any;
}

export interface EdgeCommentSearchResult {
  readonly id: string;
  readonly edgeId: string;
  readonly comment: string;
  readonly sourceLink: string;
  readonly sourceUserId: string;
  readonly timestampMs: number;
  readonly cursor: any;
}

export interface SearchForEdgeCommentsResult {
  readonly edgeComments: EdgeCommentSearchResult[];
  readonly hasMore: boolean;
}

export interface EdgeCountByNodeSearchResult {
  readonly count: number;
  readonly moreMayExist: boolean;
}

export interface ESBulkApiRequestPart {
  readonly actionAndMetadata: object;
  readonly doc?: object;
}

// ----------------------------
// NPM Registry Fetch

interface NpmRegistryPackageLinks {
  readonly npm: string;
  readonly repository?: string | null;
}

interface NpmRegistryPackage {
  readonly name: string;
  readonly description?: string | null;
  readonly links: NpmRegistryPackageLinks;
}

interface NpmRegistrySearchScoreDetail {
  readonly popularity: number;
}

interface NpmRegistrySearchScore {
  readonly detail: NpmRegistrySearchScoreDetail;
}

export interface NpmRegistrySearchObject {
  readonly package: NpmRegistryPackage;
  readonly score: NpmRegistrySearchScore;
}

export interface NpmRegistrySearchResponse {
  readonly objects: NpmRegistrySearchObject[];
}

// ----------------------------

export interface GotRequest {
  readonly uri: string;
  readonly body?: object;
}

export interface GotNDJSONRequest {
  readonly uri: string;
  readonly jsonList: object[];
}
