import PluginError from "../../src/utils/error";

describe("PluginError", () => {
  describe("toString()", () => {
    it("should serialize error", () => {
      expect(
        new PluginError(404, "Not found", {
          item: "comment",
          random: "value",
        }).toString()
      ).toMatchInlineSnapshot(`"Strapi:Plugin:Reactions - Not found"`);
      expect(new PluginError(0, "").toString()).toMatchInlineSnapshot(
        `"Strapi:Plugin:Reactions - Internal error"`
      );
    });
  });
  describe("toJSON()", () => {
    it("should serialize an error", () => {
      expect(
        new PluginError(404, "Not found", {
          item: "comment",
          random: "value",
        }).toJSON()
      ).toMatchInlineSnapshot(`
        {
          "item": "comment",
          "message": "Not found",
          "name": "Strapi:Plugin:Reactions",
          "random": "value",
        }
      `);
      expect(new PluginError(404, "Not found").toJSON()).toMatchInlineSnapshot(
        `[Strapi:Plugin:Reactions: Not found]`
      );
      expect(new PluginError(0, "").toJSON()).toMatchInlineSnapshot(
        `[Strapi:Plugin:Reactions: Internal error]`
      );
    });
  });
});
