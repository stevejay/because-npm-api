import normaliseTermForMatchSearch from "./normalise-term-for-match-search";

describe("normaliseTermForMatchSearch", () => {
  test.each([
    [null, ""],
    ["", ""],
    ["   ", ""],
    ["react router", "react router"],
    ["react", "react"],
    ["   ROUTER   ", "router"],
    ["react-router", "react router"],
    ["foobar", "foobar"],
    ["@foobar", "foobar"],
    ["@foo-bar", "foo bar"],
    ["foobar/react-router", "foobar react router"],
    ["foo-bar/reactrouter", "foo bar reactrouter"],
    ["@foo-bar/reactrouter", "foo bar reactrouter"],
    ["foobar reactrouter", "foobar reactrouter"],
    ["foo bar react router", "foo bar react router"],
    ["foobar react router", "foobar react router"],
    ["foobar/react router", "foobar react router"],
    ["foobarreactrouter", "foobarreactrouter"]
  ])("should take $o and return $o", (userInput, expected) => {
    const actual = normaliseTermForMatchSearch(userInput);
    expect(actual).toEqual(expected);
  });
});
