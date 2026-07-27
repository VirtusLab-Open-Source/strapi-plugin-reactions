import { setupStrapi, resetStrapi } from "../initSetup";
import { getPluginService } from "../../src/utils/functions";
import { IServiceAdmin } from "../../../@types";
import PluginError from "../../src/utils/error";

describe("Test admin service", () => {
  const mockReactionTypes = [
    {
      documentId: "type-1",
      slug: "like",
      name: "Like",
      icon: { id: 1, url: "/icon.png" },
    },
    {
      documentId: "type-2",
      slug: "love",
      name: "Love",
      icon: null,
    },
  ];

  const mockReactions = [
    {
      documentId: "reaction-1",
      kind: mockReactionTypes[0],
      relatedUid: "api::article.article:1",
    },
  ];

  beforeEach(() => {
    setupStrapi({}, false, {}, {
      "plugins::reactions.reaction-type": [...mockReactionTypes],
      "plugins::reactions.reaction": [...mockReactions],
    });
  });

  afterEach(() => {
    resetStrapi();
  });

  describe("fetchConfig", () => {
    it("should return plugin config with reaction types", async () => {
      const service = getPluginService<IServiceAdmin>("admin");
      const result = await service.fetchConfig();

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(result).toEqual({
        config: {
          blockedAuthorProps: [],
        },
        types: mockReactionTypes,
      });
    });
  });

  describe("createReactionType", () => {
    it("should create a reaction type", async () => {
      const service = getPluginService<IServiceAdmin>("admin");
      const payload = {
        name: "Wow",
        slug: "wow",
      };

      const result = await service.createReactionType(payload as any);

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");

      const documentsInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[
        (global.strapi.documents as unknown as jest.Mock).mock.results.length - 1
      ].value;
      expect(documentsInstance.create).toHaveBeenCalledWith({
        data: payload,
      });
      expect(result).toEqual(expect.objectContaining(payload));
    });
  });

  describe("updateReactionType", () => {
    it("should update a reaction type", async () => {
      const service = getPluginService<IServiceAdmin>("admin");
      const payload = {
        documentId: "type-1",
        name: "Like updated",
        slug: "like",
      };

      const result = await service.updateReactionType(payload as any);

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");

      const documentsInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[
        (global.strapi.documents as unknown as jest.Mock).mock.results.length - 1
      ].value;
      expect(documentsInstance.update).toHaveBeenCalledWith({
        documentId: "type-1",
        data: {
          name: "Like updated",
          slug: "like",
        },
      });
      expect(result).toEqual(expect.objectContaining({
        documentId: "type-1",
        name: "Like updated",
        slug: "like",
      }));
    });

    it("should return null when reaction type does not exist", async () => {
      const documents = global.strapi.documents("plugins::reactions.reaction-type" as any);
      const result = await documents.update({
        documentId: "missing-type",
        data: { name: "Missing" },
      } as any);

      expect(result).toBeNull();
    });
  });

  describe("updateConfig", () => {
    it("should update general plugin config", async () => {
      const service = getPluginService<IServiceAdmin>("admin");
      const blockedAuthorProps = ["email", "username"];

      const result = await service.updateConfig({ blockedAuthorProps });

      expect(result.config.blockedAuthorProps).toEqual(blockedAuthorProps);
      expect(result.types).toEqual(mockReactionTypes);
    });
  });

  describe("deleteReactionType", () => {
    it("should delete reaction type and related reactions", async () => {
      const service = getPluginService<IServiceAdmin>("admin");
      const result = await service.deleteReactionType("type-1");

      expect(result).toEqual({ result: true });
    });

    it("should throw when reaction type does not exist", async () => {
      const service = getPluginService<IServiceAdmin>("admin");

      await expect(service.deleteReactionType("missing-type")).rejects.toBeInstanceOf(PluginError);
    });
  });
});
