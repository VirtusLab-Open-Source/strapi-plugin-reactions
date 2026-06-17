import { setupStrapi, resetStrapi } from "../initSetup";
import { getPluginService } from "../../src/utils/functions";
import { IServiceEnrich } from "../../../@types";

describe("Test enrich service", () => {
  const uid = "api::article.article";

  const mockUser = {
    documentId: "user-1",
    username: "testuser",
    email: "test@example.com",
  };

  const mockReactionTypes = {
    like: {
      documentId: "type-1",
      slug: "like",
      name: "Like",
      emoji: "👍",
    },
    love: {
      documentId: "type-2",
      slug: "love",
      name: "Love",
      emoji: "❤️",
    },
  };

  const createReaction = (overrides: Record<string, unknown> = {}) => ({
    documentId: "reaction-1",
    kind: mockReactionTypes.like,
    user: mockUser,
    relatedUid: "api::article.article:doc-1",
    ...overrides,
  });

  const defaultPopulate = {
    kind: {
      fields: ["name", "slug", "emoji", "emojiFallbackUrl"],
      populate: ["icon"],
    },
    user: {
      fields: ["username", "email"],
    },
  };

  afterEach(() => {
    resetStrapi();
  });

  describe("sanitizeReactions", () => {
    it("should strip blocked author properties from reaction users", async () => {
      setupStrapi({ blockedAuthorProps: ["email"] }, false, {}, {});

      const service = getPluginService<IServiceEnrich>("enrich");
      const result = await service.sanitizeReactions([createReaction()]);

      expect(result[0].user).toEqual({
        documentId: "user-1",
        username: "testuser",
      });
    });

    it("should read blockedAuthorProps from plugin store", async () => {
      setupStrapi({ blockedAuthorProps: ["email", "username"] }, true, {}, {});

      const service = getPluginService<IServiceEnrich>("enrich");
      const result = await service.sanitizeReactions([createReaction()]);

      expect(result[0].user).toEqual({
        documentId: "user-1",
      });
    });

    it("should return reactions unchanged when blockedAuthorProps is empty", async () => {
      setupStrapi({}, false, {}, {});

      const service = getPluginService<IServiceEnrich>("enrich");
      const reactions = [createReaction()];
      const result = await service.sanitizeReactions(reactions);

      expect(result).toEqual(reactions);
    });
  });

  describe("composeReactionsMeta", () => {
    it("should group reactions by kind slug", () => {
      setupStrapi({}, false, {}, {});

      const service = getPluginService<IServiceEnrich>("enrich");
      const reactions = [
        createReaction({ documentId: "reaction-1" }),
        createReaction({
          documentId: "reaction-2",
          kind: mockReactionTypes.love,
        }),
        createReaction({ documentId: "reaction-3" }),
      ];

      const result = reactions.reduce(service.composeReactionsMeta, {});

      expect(result).toEqual({
        like: [reactions[0], reactions[2]],
        love: [reactions[1]],
      });
    });
  });

  describe("enrichOne", () => {
    it("should return response unchanged when response is falsy", async () => {
      setupStrapi({}, false, {}, {});

      const service = getPluginService<IServiceEnrich>("enrich");

      await expect(service.enrichOne(uid, null as any, undefined as any)).resolves.toBeNull();
      await expect(service.enrichOne(uid, undefined as any, undefined as any)).resolves.toBeUndefined();
    });

    it("should enrich response meta with sanitized reactions grouped by slug", async () => {
      const reactions = [
        createReaction({ documentId: "reaction-1" }),
        createReaction({
          documentId: "reaction-2",
          kind: mockReactionTypes.love,
        }),
      ];

      setupStrapi({ blockedAuthorProps: ["email"] }, false, {}, {
        "plugins::reactions.reaction": reactions,
      });

      const service = getPluginService<IServiceEnrich>("enrich");
      const response = {
        data: { documentId: "doc-1", title: "Test Article", locale: "en" },
        meta: { pagination: { page: 1 } },
      };

      const result = await service.enrichOne(uid, response, undefined as any);

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");

      const documentsInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[0].value;
      expect(documentsInstance.findMany).toHaveBeenCalledWith({
        filters: {
          relatedUid: "api::article.article:doc-1",
        },
        populate: defaultPopulate,
        locale: "en",
      });

      expect(result.data).toEqual(response.data);
      expect(result.meta).toEqual({
        pagination: { page: 1 },
        reactions: {
          like: [
            expect.objectContaining({
              documentId: "reaction-1",
              user: {
                documentId: "user-1",
                username: "testuser",
              },
            }),
          ],
          love: [
            expect.objectContaining({
              documentId: "reaction-2",
              user: {
                documentId: "user-1",
                username: "testuser",
              },
            }),
          ],
        },
      });
    });

    it("should return empty reactions meta when no reactions are found", async () => {
      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction": [],
      });

      const service = getPluginService<IServiceEnrich>("enrich");
      const response = {
        data: { documentId: "doc-1", locale: "en" },
        meta: {},
      };

      const result = await service.enrichOne(uid, response, undefined as any);

      expect((result.meta as any).reactions).toEqual({});
    });
  });

  describe("enrichMany", () => {
    it("should return response unchanged when response is falsy", async () => {
      setupStrapi({}, false, {}, {});

      const service = getPluginService<IServiceEnrich>("enrich");

      await expect(service.enrichMany(uid, null as any, undefined as any)).resolves.toBeNull();
      await expect(service.enrichMany(uid, undefined as any, undefined as any)).resolves.toBeUndefined();
    });

    it("should map sanitized reactions per documentId", async () => {
      const reactions = [
        createReaction({
          documentId: "reaction-1",
          relatedUid: "api::article.article:doc-1",
        }),
        createReaction({
          documentId: "reaction-2",
          kind: mockReactionTypes.love,
          relatedUid: "api::article.article:doc-2",
        }),
      ];

      setupStrapi({ blockedAuthorProps: ["email", "username"] }, false, {}, {
        "plugins::reactions.reaction": reactions,
      });

      const service = getPluginService<IServiceEnrich>("enrich");
      const response = {
        data: [
          { documentId: "doc-1", locale: "en" },
          { documentId: "doc-2", locale: "en" },
        ],
        meta: { pagination: { page: 1 } },
      };

      const result = await service.enrichMany(uid, response, undefined as any);

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");

      const documentsInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[0].value;
      expect(documentsInstance.findMany).toHaveBeenCalledWith({
        filters: {
          relatedUid: {
            $contains: "api::article.article:",
          },
        },
        populate: defaultPopulate,
        locale: "en",
      });

      expect(result.data).toEqual(response.data);
      expect(result.meta).toEqual({
        pagination: { page: 1 },
        reactions: {
          "doc-1": {
            like: [
              expect.objectContaining({
                documentId: "reaction-1",
                user: {
                  documentId: "user-1",
                },
              }),
            ],
          },
          "doc-2": {
            love: [
              expect.objectContaining({
                documentId: "reaction-2",
                user: {
                  documentId: "user-1",
                },
              }),
            ],
          },
        },
      });
    });
  });
});
