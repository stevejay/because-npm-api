import * as cursor from "./cursor";

describe("create", () => {
  it("should create a cursor", () => {
    const actual = cursor.create([0.12, "foo", "bar"]);
    expect(actual).toEqual("WzAuMTIsImZvbyIsImJhciJd");
  });
});

describe("parse", () => {
  it("should parse a cursor", () => {
    const actual = cursor.parse("WzAuMTIsImZvbyIsImJhciJd");
    expect(actual).toEqual([0.12, "foo", "bar"]);
  });
});
