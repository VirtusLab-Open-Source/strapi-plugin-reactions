import getApiURL from "../getApiUrl";

describe("getApiURL()", () => {
  it("should return valid URL", () => {
    expect(getApiURL("test")).toMatchInlineSnapshot(`"/reactions/test"`);
  });
});
