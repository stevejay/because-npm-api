import * as tweetParser from "./tweet-parser";

// describe("validateTweet", () => {
//   test.each([
//     [{
//       text: "   @BecauseNpm  because Some random message "
//     }, false],
//     ["@BecauseNpm redux-form to final-form  bc        ", false],
//     ["    redux-form   b/c   ReduxForm is just great   @BecauseNpm  ", false],
//     [
//       "  @BecauseNpm    redux-form to final-form  bc   FinalForm is just great     ",
//       true
//     ],
//     [
//       "@BecauseNpm  @steve-jay/redux-form to @adylic/final-form  b/c   FinalForm is just great     ",
//       true
//     ],
//     ["@BecauseNpm redux-form to redux-form bc FinalForm is just great", false]
//   ])("%o should return %o", (text, expected) => {
//     const actual = tweetParser.validateTweet(text);
//     expect(actual).toEqual(expected);
//   });
// });

describe("parseTweet", () => {
  test.each([
    [
      {
        id: "1111",
        creatorId: "2222",
        creatorUsername: "Steve",
        timestampMs: "3333",
        text: "   @BecauseNpm  because Some random message "
      },
      null
    ],
    [
      {
        id: "1111",
        creatorId: "2222",
        creatorUsername: "Steve",
        timestampMs: "3333",
        text: "@BecauseNpm redux-form to final-form  bc        "
      },
      null
    ],
    [
      {
        id: "1111",
        creatorId: "2222",
        creatorUsername: "Steve",
        timestampMs: "3333",
        text: "    redux-form   b/c   ReduxForm is just great   @BecauseNpm  "
      },
      null
    ],
    [
      {
        id: "1111",
        creatorId: "2222",
        creatorUsername: "Steve",
        timestampMs: "3333",
        text:
          "  @BecauseNpm    redux-form to final-form  bc   FinalForm is just great     "
      },
      {
        id: "1111",
        creatorId: "2222",
        creatorUsername: "Steve",
        timestampMs: "3333",
        text:
          "  @BecauseNpm    redux-form to final-form  bc   FinalForm is just great     ",
        comment: "FinalForm is just great",
        tailNodeId: "redux-form",
        headNodeId: "final-form",
        nodesNotFound: false
      }
    ],
    [
      {
        id: "1111",
        creatorId: "2222",
        creatorUsername: "Steve",
        timestampMs: "3333",
        text:
          "@BecauseNpm  @steve-jay/redux-form to @adylic/final-form  because   FinalForm is just great     "
      },
      {
        id: "1111",
        creatorId: "2222",
        creatorUsername: "Steve",
        timestampMs: "3333",
        text:
          "@BecauseNpm  @steve-jay/redux-form to @adylic/final-form  because   FinalForm is just great     ",
        comment: "FinalForm is just great",
        tailNodeId: "@steve-jay/redux-form",
        headNodeId: "@adylic/final-form",
        nodesNotFound: false
      }
    ],
    [
      {
        text: "@BecauseNpm redux-form to redux-form bc FinalForm is just great"
      },
      null
    ]
  ])("%o should parse to %o", (text, expected) => {
    const actual = tweetParser.parseTweet(text);
    expect(actual).toEqual(expected);
  });
});

describe("getTweetTextFromTweet", () => {
  test.each([
    [
      {
        extended_tweet: {
          full_text: "01234567",
          display_text_range: [1, 3]
        }
      },
      "12"
    ],
    [
      {
        full_text: "01234567",
        display_text_range: [0, 8]
      },
      "01234567"
    ],
    [
      {
        text: "01234567"
      },
      "01234567"
    ],
    [
      {
        text: "01234567",
        truncated: true
      },
      ""
    ]
  ])("should parse %o to get %s", (tweet, expected) => {
    const actual = tweetParser.getTweetTextFromTweet(tweet);
    expect(actual).toEqual(expected);
  });
});
