import delay from "delay";
import got from "got";

export async function eventuallyGetDocument(
  index: string,
  id: string,
  maxTries: number
): Promise<any> {
  let tries = 0;
  let lastError = null;

  while (true) {
    try {
      const uri = `http://localhost:4571/${index}/_doc/${encodeURIComponent(
        id
      )}`;
      const response = await got(uri, { method: "GET", json: true });
      return response.body._source;
    } catch (error) {
      lastError = error;
    }

    tries = tries + 1;
    if (tries > maxTries) {
      throw new Error(
        `The document http://localhost:4571/${index}/_doc/${encodeURIComponent(
          id
        )} did not appear in time. ${lastError ? lastError.message : ""}`
      );
    } else {
      await delay(1000);
    }
  }
}
