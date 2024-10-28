import PluginError from "../../../src/utils/error";

jest.mock;

describe("Test Reaction controller functions utils", () => {
  describe("Errors serialization", () => {
    test("Should throw error PluginError", () => {

      try {
        throw new PluginError(400, "Error message", {
          content: {
            param: "Parameter value",
          },
        });
      } catch (e) {
        expect(e).toBeInstanceOf(PluginError);
        expect(e).toHaveProperty("status", 400);
        expect(e).toHaveProperty("name", "Strapi:Plugin:Reactions");
        expect(e).toHaveProperty("message", "Error message");
        expect(e).toHaveProperty("payload");
        expect(e.payload).toEqual(
          expect.objectContaining({
            content: {
              param: "Parameter value",
            },
          })
        );
      }
    });
  });
});
