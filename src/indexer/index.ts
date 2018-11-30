import * as esWrapper from "../library-wrappers/es-wrapper";
import { Comment } from "../types/custom";
import * as mapper from "./mapper";

export async function indexComment(comment: Comment): Promise<void> {
  const request = mapper.mapMultiIndexRequestForBulkApi(comment);
  await esWrapper.postNDJSON(request);
}
