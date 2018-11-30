import computeResponseToken from "./compute-response-token";

describe("computeResponseToken", () => {
  it("should compute the response token", async () => {
    const actual = await computeResponseToken("sometoken");
    expect(actual).toEqual(
      "sha256=IUQVD6YmvIpPEmt6P88OTJTjBMjo5mR65c2EfFb3dzw="
    );
  });
});
