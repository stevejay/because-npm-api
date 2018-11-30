import * as mapper from "./mapper";

describe("mapTwitterWebhookRequest", () => {
  test.each([
    [
      { queryStringParameters: { crc_token: "1234" } },
      { crcToken: "1234", message: null }
    ],
    [
      // tslint:disable-next-line
      { body: '{"for_user_id":"8479234124"}' },
      { crcToken: null, message: { for_user_id: "8479234124" } }
    ],
    [{}, { crcToken: null, message: null }]
  ])("%o should map to %o", (event, expected) => {
    const actual = mapper.mapTwitterWebhookRequest(event);
    expect(actual).toEqual(expected);
  });
});

describe("mapTweetCreatedMessages", () => {
  test.each([
    [{ Records: [] }, { messages: [] }],
    // tslint:disable-next-line
    [{ Records: [{ body: '{"id":"5678"}' }] }, { messages: [{ id: "5678" }] }]
  ])("%o should map to %o", (event, expected) => {
    const actual = mapper.mapTweetCreatedMessages(event);
    expect(actual).toEqual(expected);
  });
});
