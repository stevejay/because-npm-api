import * as mapper from "./mapper";

describe("mapMessagesForBatchRequests", () => {
  test.each([
    [
      [{ id: "1", json: { a: "a" } }],
      [
        {
          Entries: [{ Id: "1", MessageBody: JSON.stringify({ a: "a" }) }],
          QueueUrl: "https://the.url/"
        }
      ]
    ],
    [
      [
        { id: "1", json: { a: "a" } },
        { id: "2", json: { a: "a" } },
        { id: "3", json: { a: "a" } },
        { id: "4", json: { a: "a" } },
        { id: "5", json: { a: "a" } },
        { id: "6", json: { a: "a" } },
        { id: "7", json: { a: "a" } },
        { id: "8", json: { a: "a" } },
        { id: "9", json: { a: "a" } },
        { id: "10", json: { a: "a" } },
        { id: "11", json: { a: "a" } }
      ],
      [
        {
          Entries: [
            { Id: "1", MessageBody: JSON.stringify({ a: "a" }) },
            { Id: "2", MessageBody: JSON.stringify({ a: "a" }) },
            { Id: "3", MessageBody: JSON.stringify({ a: "a" }) },
            { Id: "4", MessageBody: JSON.stringify({ a: "a" }) },
            { Id: "5", MessageBody: JSON.stringify({ a: "a" }) },
            { Id: "6", MessageBody: JSON.stringify({ a: "a" }) },
            { Id: "7", MessageBody: JSON.stringify({ a: "a" }) },
            { Id: "8", MessageBody: JSON.stringify({ a: "a" }) },
            { Id: "9", MessageBody: JSON.stringify({ a: "a" }) },
            { Id: "10", MessageBody: JSON.stringify({ a: "a" }) }
          ],
          QueueUrl: "https://the.url/"
        },
        {
          Entries: [{ Id: "11", MessageBody: JSON.stringify({ a: "a" }) }],
          QueueUrl: "https://the.url/"
        }
      ]
    ]
  ])("should map messages %o to %o", (messages, expected) => {
    const actual = mapper.mapMessagesForBatchRequests(
      messages,
      "https://the.url/"
    );
    expect(actual).toEqual(expected);
  });
});
