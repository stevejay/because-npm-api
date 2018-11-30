import createBucketKey from "./create-bucket-key";

describe("createBucketKey", () => {
  test.each([["12345678", "12/34/12345678"], ["12345678", "12/34/12345678"]])(
    "should use %s and %s to create %s",
    (id, expected) => {
      const actual = createBucketKey(id);
      expect(actual).toEqual(expected);
    }
  );
});
