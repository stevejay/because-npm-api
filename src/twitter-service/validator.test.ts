import * as validator from "./validator";

describe("validateTweetCreatedMessage", () => {
  test.each([
    [null, false],
    [{}, false],
    [
      {
        id: "12345678",
        text: "the text",
        creatorId: "1111",
        creatorUsername: "@Foo",
        timestampMs: "2222"
      },
      true
    ]
  ])("should validate %o as %o", async (message, shouldValidate) => {
    try {
      await validator.validateTweetCreatedMessage(message);
      throw new Error("validated");
    } catch (error) {
      if (error.message === "validated") {
        if (!shouldValidate) {
          throw new Error("message validated when it should not have");
        }
      } else {
        if (shouldValidate) {
          throw new Error(
            `message did not validate when it should have: ${error.message}`
          );
        }
      }
    }
  });
});

describe("validateComment", () => {
  test.each([
    [null, false],
    [{}, false],
    [
      {
        id: "12345678",
        comment: "Some comment",
        source: "twitter",
        sourceLink: "http://twitter/foo",
        sourceUserId: "1111",
        timestampMs: "2222",
        tailNode: {
          id: "react",
          description: "react description",
          link: "http://npm.com/react",
          score: 0,
          isNew: true
        },
        headNode: {
          description: "redux description",
          link: "http://npm.com/redux",
          score: 1,
          isNew: false
        }
      },
      false
    ],
    [
      {
        id: "12345678",
        comment: "Some comment",
        source: "twitter",
        sourceLink: "http://twitter/foo",
        sourceUserId: "1111",
        timestampMs: "2222",
        tailNode: {
          id: "react",
          description: "react description",
          link: "http://npm.com/react",
          score: 0,
          isNew: true
        },
        headNode: {
          id: "redux",
          description: "redux description",
          link: "http://npm.com/redux",
          score: 1,
          isNew: false
        }
      },
      true
    ]
  ])("should validate %o as %o", async (comment, shouldValidate) => {
    try {
      await validator.validateComment(comment);
      throw new Error("validated");
    } catch (error) {
      if (error.message === "validated") {
        if (!shouldValidate) {
          throw new Error("comment validated when it should not have");
        }
      } else {
        if (shouldValidate) {
          throw new Error(
            `comment did not validate when it should have: ${error.message}`
          );
        }
      }
    }
  });
});
