import normaliseTermForSuggestionSearch from "./normalise-term-for-suggestion-search";

describe("normaliseTermForSuggestionSearch", () => {
  test.each([
    [null, ""],
    ["", ""],
    ["   ", ""],
    ["react router", "reactrouter"],
    ["react", "react"],
    ["   ROUTER   ", "router"],
    ["react-router", "reactrouter"],
    ["foobar", "foobar"],
    ["@foobar", "@foobar"],
    ["@foo-bar", "@foobar"],
    ["foobar/react-router", "foobarreactrouter"],
    ["foo-bar/reactrouter", "foobarreactrouter"],
    ["@foo-bar/reactrouter", "@foobarreactrouter"],
    ["foobar reactrouter", "foobarreactrouter"],
    ["foo bar react router", "foobarreactrouter"],
    ["foobar react router", "foobarreactrouter"],
    ["foobar/react router", "foobarreactrouter"],
    ["foobarreactrouter", "foobarreactrouter"]
  ])("should take $o and return $o", (userInput, expected) => {
    const actual = normaliseTermForSuggestionSearch(userInput);
    expect(actual).toEqual(expected);
  });
});
