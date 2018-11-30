// tslint:disable:ordered-imports
// Note: I had to disable the rule for this whole file to allow
// the xray setup import to be first.
import "./xray-setup";
import { ApolloServer } from "apollo-server-lambda";
import log from "loglevel";
import * as typeDefs from "../graphql-service/schema.gql";
import resolvers from "../graphql-service/resolvers";

log.setLevel(log.levels.WARN);
const server = new ApolloServer({ typeDefs, resolvers });

export const handler = server.createHandler({
  cors: { origin: "*", credentials: true }
});
