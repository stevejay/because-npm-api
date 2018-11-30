import delay from "delay";
import clientWrapper from "dynamodb-doc-client-wrapper";

const client = clientWrapper({
  connection: {
    region: "localhost",
    endpoint: "http://localhost:4569"
  }
});

export async function eventuallyGetDocument(
  tableName: string,
  id: string,
  maxTries: number
) {
  let tries = 0;

  while (true) {
    const document = await client.tryGet({
      TableName: tableName,
      Key: { id }
    });

    if (document) {
      return document;
    }

    tries = tries + 1;
    if (tries > maxTries) {
      throw new Error(
        `The document with id ${id} in table ${tableName} did not appear in time`
      );
    } else {
      await delay(1000);
    }
  }
}

export async function deleteDocumentFromTable(tableName: string, id: string) {
  await client.delete({
    TableName: tableName,
    Key: { id }
  });
}

export async function addDocumentToTable(tableName: string, document: any) {
  await client.put({
    TableName: tableName,
    Item: document
  });
}
