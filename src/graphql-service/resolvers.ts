import { GraphQLResolveInfo } from "graphql";
import * as searcher from "../searcher";
import * as mapper from "./mapper";

export default {
  Query: {
    async node(
      _parent: undefined,
      args: any,
      _context: undefined,
      info: GraphQLResolveInfo
    ) {
      const request = mapper.mapGetNodeRequest(args, info);
      const result = await searcher.getNode(request);
      return mapper.mapGetNodeResult(result);
    },
    async autocompleteNodeSearch(
      _parent: undefined,
      args: any,
      _context: undefined,
      info: GraphQLResolveInfo
    ) {
      const request = mapper.mapAutocompleteSearchForNodesRequest(args, info);
      const result = await searcher.autocompleteSearchForNodes(request);
      return mapper.mapAutocompleteSearchForNodesResult(result);
    },
    async nodeSearch(
      _parent: undefined,
      args: any,
      _context: undefined,
      info: GraphQLResolveInfo
    ) {
      const request = mapper.mapSearchForNodesRequest(args, info);
      const result = await searcher.searchForNodes(request);
      return mapper.mapSearchForNodesResult(result);
    },
    async edgeSearch(_parent: undefined, args: any) {
      const request = mapper.mapSearchForEdgesRequest(args);
      const result = await searcher.searchForEdges(request);
      return mapper.mapSearchForEdgesResult(result);
    },
    async edgeCommentSearch(_parent: undefined, args: any) {
      const request = mapper.mapSearchForEdgeCommentsRequest(args);
      const result = await searcher.searchForEdgeComments(request);
      return mapper.mapSearchForEdgeCommentsResult(result);
    }
  }
};
