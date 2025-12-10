import { setupStrapi, resetStrapi } from "../initSetup";
import { getPluginService } from "../../src/utils/functions";
import { IServiceClient } from "../../../@types";

describe("Test client service", () => {
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

  const mockUser = {
    documentId: "user-1",
    username: "testuser",
    email: "test@example.com",
  };

  const mockReactions = [
    {
      documentId: "reaction-1",
      kind: { documentId: "type-1", slug: "like", name: "Like" },
      user: mockUser,
      relatedUid: "api::article.article:1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      documentId: "reaction-2",
      kind: { documentId: "type-2", slug: "love", name: "Love" },
      user: { documentId: "user-2", username: "testuser2", email: "test2@example.com" },
      relatedUid: "api::article.article:2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockRelatedEntity = {
    documentId: "123",
    title: "Test Article",
    locale: "en",
  };

  beforeEach(() => {
    setupStrapi({}, false, {}, {
      "plugins::reactions.reaction-type": mockReactionTypes,
      "plugins::reactions.reaction": mockReactions,
      "api::article.article": [mockRelatedEntity],
    });
  });

  afterEach(() => {
    resetStrapi();
  });

  describe("kinds", () => {
    it("should find kinds and return data", async () => {

      const service = getPluginService<IServiceClient>("client");
      const result = await service.kinds();

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      
      const documentsInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[0].value;
      expect(documentsInstance.findMany).toHaveBeenCalledWith({
        populate: ["icon"],
      });
      
      expect(result).toEqual(mockReactionTypes);
    });
  });

  describe("list", () => {
    it("should return list of all reactions when no parameters provided", async () => {

      const service = getPluginService<IServiceClient>("client");
      await service.list();

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const documentsInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[0].value;
      expect(documentsInstance.findMany).toHaveBeenCalledWith({
        fields: ["createdAt", "updatedAt", "userId"],
        filters: {
          relatedUid: {
            $contains: "",
          },
        },
        populate: {
          kind: {
            fields: ["slug", "name"],
          },
          user: {
            fields: ["documentId", "username", "email"],
          },
        },
        locale: undefined,
      });
    });

    it("should find many with kind filter when only kind parameter is provided", async () => {

      const service = getPluginService<IServiceClient>("client");
      await service.list("like");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const reactionTypeInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[0].value;
      expect(reactionTypeInstance.findFirst).toHaveBeenCalledWith({
        filters: { slug: "like" },
      });
      
      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[1].value;
      expect(reactionInstance.findMany).toHaveBeenCalledWith({
        fields: ["createdAt", "updatedAt", "userId"],
        filters: {
          relatedUid: {
            $contains: "",
          },
          kind: mockReactionTypes[0],
        },
        populate: {
          user: {
            fields: ["documentId", "username", "email"],
          },
        },
        locale: undefined,
      });
    });

    it("should find many with all filters when all params provided with user and without authorId", async () => {

      const service = getPluginService<IServiceClient>("client");
      await service.list("like", "api::article.article", mockUser, "123", "en");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[1].value;
      expect(reactionInstance.findMany).toHaveBeenCalledWith({
        fields: ["createdAt", "updatedAt"],
        filters: {
          relatedUid: {
            $eq: "api::article.article:123",
          },
          kind: mockReactionTypes[0],
          user: mockUser,
        },
        populate: {},
        locale: "en",
      });
    });

    it("should find many with all filters when all params provided without user and with authorId", async () => {

      const service = getPluginService<IServiceClient>("client");
      await service.list("like", "api::article.article", undefined, "123", "en", "author-123");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[1].value;
      expect(reactionInstance.findMany).toHaveBeenCalledWith({
        fields: ["createdAt", "updatedAt", "userId"],
        filters: {
          relatedUid: {
            $eq: "api::article.article:123",
          },
          kind: mockReactionTypes[0],
          userId: {
            $eq: "author-123",
          },
        },
        populate: {},
        locale: "en",
      });
    });
  });

  describe("listPerUser", () => {
    it("should find reactions per user when only user is provided", async () => {

      const service = getPluginService<IServiceClient>("client");
      await service.listPerUser(mockUser, undefined);

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[0].value;
      expect(reactionInstance.findMany).toHaveBeenCalledWith({
        fields: ["createdAt", "updatedAt", "relatedUid"],
        filters: {
          user: mockUser,
        },
        populate: {
          related: true,
          kind: {
            fields: ["slug", "name"],
          },
        },
        sort: undefined,
        pagination: undefined,
        locale: "*",
      });
    });

    it("should find reactions per user when only userId is provided", async () => {

      const service = getPluginService<IServiceClient>("client");
      await service.listPerUser(undefined, "user-1");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[0].value;
      expect(reactionInstance.findMany).toHaveBeenCalledWith({
        fields: ["createdAt", "updatedAt", "relatedUid"],
        filters: {
          userId: "user-1",
        },
        populate: {
          related: true,
          kind: {
            fields: ["slug", "name"],
          },
        },
        sort: undefined,
        pagination: undefined,
        locale: "*",
      });
    });

    it("should find reactions per user and userId when both user and userId are provided", async () => {
      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction": [
          {
            documentId: "reaction-1",
            kind: mockReactionTypes[0],
            userId: "user-2",
            relatedUid: "api::article.article:1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });

      const service = getPluginService<IServiceClient>("client");
      await service.listPerUser(mockUser, "user-2");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[0].value;
      expect(reactionInstance.findMany).toHaveBeenCalledWith({
        fields: ["createdAt", "updatedAt", "relatedUid"],
        filters: {
          user: mockUser,
          userId: "user-2",
        },
        populate: {
          related: true,
          kind: {
            fields: ["slug", "name"],
          },
        },
        sort: undefined,
        pagination: undefined,
        locale: "*",
      });
    });

    it("should find reactions per user with kind filter", async () => {

      const service = getPluginService<IServiceClient>("client");
      await service.listPerUser(mockUser, undefined, "like");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[1].value;
      expect(reactionInstance.findMany).toHaveBeenCalledWith({
        fields: ["createdAt", "updatedAt", "relatedUid"],
        filters: {
          user: mockUser,
          kind: mockReactionTypes[0],
        },
        populate: {
          related: true,
        },
        sort: undefined,
        pagination: undefined,
        locale: "*",
      });
    });
  });

  describe("create", () => {
    it("should create reaction when no existing reaction found", async () => {
      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": [mockReactionTypes[0]],
        "plugins::reactions.reaction": [],
        "api::article.article": [mockRelatedEntity],
      });

      const service = getPluginService<IServiceClient>("client");
      await service.create("like", "api::article.article", mockUser, "123", "en");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(global.strapi.documents).toHaveBeenCalledWith("api::article.article");
      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");

      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[4].value;
      expect(reactionInstance.create).toHaveBeenCalledWith({
        data: {
          kind: mockReactionTypes[0],
          related: {
            ...mockRelatedEntity,
            __type: "api::article.article",
          },
          relatedUid: "api::article.article:123",
          user: mockUser,
          userId: undefined,
        },
        locale: "en",
      });
    });

    it("should create reaction with authorId when provided", async () => {
      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": [mockReactionTypes[0]],
        "plugins::reactions.reaction": [],
        "api::article.article": [mockRelatedEntity],
      });

      const service = getPluginService<IServiceClient>("client");
      await service.create("like", "api::article.article", mockUser, "123", "en", "author-123");

      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[4].value;
      expect(reactionInstance.create).toHaveBeenCalledWith({
        data: {
          kind: mockReactionTypes[0],
          related: {
            ...mockRelatedEntity,
            __type: "api::article.article",
          },
          relatedUid: "api::article.article:123",
          user: mockUser,
          userId: "author-123",
        },
        locale: "en",
      });
    });

    it("should throw error when reaction already exists", async () => {
      const existingReaction = {
        documentId: "reaction-1",
        kind: mockReactionTypes[0],
        user: mockUser,
        relatedUid: "api::article.article:123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": [mockReactionTypes[0]],
        "plugins::reactions.reaction": [existingReaction],
        "api::article.article": [mockRelatedEntity],
      });

      const service = getPluginService<IServiceClient>("client");
      
      await expect(
        service.create("like", "api::article.article", mockUser, "123", "en")
      ).rejects.toThrow("Can't perform CREATE on reaction type of \"like\" for Entity with ID: 123 of type: api::article.article as it already exist");
    });
  });

  describe("delete", () => {
    it("should delete reaction when exactly one reaction found", async () => {
      const existingReaction = {
        documentId: "reaction-1",
        kind: mockReactionTypes[0],
        user: mockUser,
        relatedUid: "api::article.article:123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": [mockReactionTypes[0]],
        "plugins::reactions.reaction": [existingReaction],
      });

      const service = getPluginService<IServiceClient>("client");
      await service.delete("like", "api::article.article", mockUser, "123", "en");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[2].value;
      expect(reactionInstance.delete).toHaveBeenCalledWith({
        documentId: "reaction-1",
        locale: "en",
      });
    });

    it("should delete reaction with authorId when provided", async () => {
      const existingReaction = {
        documentId: "reaction-1",
        kind: mockReactionTypes[0],
        userId: "author-123",
        relatedUid: "api::article.article:123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": [mockReactionTypes[0]],
        "plugins::reactions.reaction": [existingReaction],
      });

      const service = getPluginService<IServiceClient>("client");

      await service.delete("like", "api::article.article", mockUser, "123", "en", "author-123");

      const reactionInstance = (global.strapi.documents as unknown as jest.Mock).mock.results[2].value;
      expect(reactionInstance.delete).toHaveBeenCalledWith({
        documentId: "reaction-1",
        locale: "en",
      });
    });

    it("should throw error when no reaction found", async () => {
      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": [mockReactionTypes[0]],
        "plugins::reactions.reaction": [],
      });

      const service = getPluginService<IServiceClient>("client");
      
      await expect(
        service.delete("like", "api::article.article", mockUser, "123", "en")
      ).rejects.toThrow("Can't perform DELETE on reaction type of \"like\" for Entity with ID: 123 of type: api::article.article");
    });

    it("should throw error when multiple reactions found", async () => {
      const existingReactions = [
        {
          documentId: "reaction-1",
          kind: mockReactionTypes[0],
          user: mockUser,
          relatedUid: "api::article.article:123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: "reaction-2",
          kind: mockReactionTypes[0],
          user: mockUser,
          relatedUid: "api::article.article:123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": [mockReactionTypes[0]],
        "plugins::reactions.reaction": existingReactions,
      });

      const service = getPluginService<IServiceClient>("client");
      
      await expect(
        service.delete("like", "api::article.article", mockUser, "123", "en")
      ).rejects.toThrow("Can't perform DELETE on reaction type of \"like\" for Entity with ID: 123 of type: api::article.article");
    });
  });

  describe("toggle", () => {
    it("should delete all reactions when toggling existing reaction", async () => {
      const existingReactions = [
        {
          documentId: "reaction-1",
          kind: { documentId: "type-1", slug: "like", name: "Like" },
          user: mockUser,
          relatedUid: "api::article.article:123",
          locale: "en",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: "reaction-2",
          kind: { documentId: "type-2", slug: "love", name: "Love" },
          user: mockUser,
          relatedUid: "api::article.article:123",
          locale: "en",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": mockReactionTypes,
        "plugins::reactions.reaction": existingReactions,
        "api::article.article": [mockRelatedEntity],
      });

      const service = getPluginService<IServiceClient>("client");
      await service.toggle("like", "api::article.article", mockUser, "123", "en");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(global.strapi.documents).toHaveBeenCalledWith("api::article.article");
      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");

      const reactionInstance1 = (global.strapi.documents as unknown as jest.Mock).mock.results[3].value;
      expect(reactionInstance1.delete).toHaveBeenCalledWith({
        documentId: "reaction-1",
        locale: "en",
      });
      const reactionInstance2 = (global.strapi.documents as unknown as jest.Mock).mock.results[4].value;
      expect(reactionInstance2.delete).toHaveBeenCalledWith({
        documentId: "reaction-2",
        locale: "en",
      });
    });

    it("should remove all existing reactions and create a new reaction when no matching reaction exists", async () => {
      const existingReactions = [
        {
          documentId: "reaction-2",
          kind: { documentId: "type-2", slug: "love", name: "Love" },
          user: mockUser,
          relatedUid: "api::article.article:123",
          locale: "en",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": mockReactionTypes,
        "plugins::reactions.reaction": existingReactions,
        "api::article.article": [mockRelatedEntity],
      });

      const service = getPluginService<IServiceClient>("client");
      await service.toggle("like", "api::article.article", mockUser, "123", "en");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(global.strapi.documents).toHaveBeenCalledWith("api::article.article");
      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const documentsMock = global.strapi.documents as unknown as jest.Mock;
      const reactionInstances = documentsMock.mock.results
        .map((result, index) => ({
          uid: documentsMock.mock.calls[index][0],
          instance: result.value,
        }))
        .filter(({ uid }) => uid === "plugins::reactions.reaction");
      
      const deleteCalls = reactionInstances.flatMap(({ instance }) => 
        (instance.delete as jest.Mock).mock.calls
      );
      expect(deleteCalls).toContainEqual([{ documentId: "reaction-2", locale: "en" }]);
      
      const createCalls = reactionInstances.flatMap(({ instance }) => 
        (instance.create as jest.Mock).mock.calls
      );
      expect(createCalls).toContainEqual([{
        data: {
          kind: mockReactionTypes[0],
          related: {
            ...mockRelatedEntity,
            __type: "api::article.article",
          },
          relatedUid: "api::article.article:123",
          user: mockUser,
          userId: undefined,
        },
        locale: "en",
      }]);
    });

    it("should create reaction when no existing reactions", async () => {
      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": [mockReactionTypes[0]],
        "plugins::reactions.reaction": [],
        "api::article.article": [mockRelatedEntity],
      });

      const service = getPluginService<IServiceClient>("client");
      await service.toggle("like", "api::article.article", mockUser, "123", "en");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(global.strapi.documents).toHaveBeenCalledWith("api::article.article");
      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const documentsMock = global.strapi.documents as unknown as jest.Mock;
      const reactionInstances = documentsMock.mock.results
        .map((result, index) => ({
          uid: documentsMock.mock.calls[index][0],
          instance: result.value,
        }))
        .filter(({ uid }) => uid === "plugins::reactions.reaction");
      
      // Check that create was called
      const createCalls = reactionInstances.flatMap(({ instance }) => 
        (instance.create as jest.Mock).mock.calls
      );
      expect(createCalls).toContainEqual([{
        data: {
          kind: mockReactionTypes[0],
          related: {
            ...mockRelatedEntity,
            __type: "api::article.article",
          },
          relatedUid: "api::article.article:123",
          user: mockUser,
          userId: undefined,
        },
        locale: "en",
      }]);
    });

    it("should toggle with authorId when provided", async () => {
      const existingReactions = [
        {
          documentId: "reaction-1",
          kind: { documentId: "type-1", slug: "like", name: "Like" },
          userId: "author-123",
          relatedUid: "api::article.article:123",
          locale: "en",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      setupStrapi({}, false, {}, {
        "plugins::reactions.reaction-type": [mockReactionTypes[0]],
        "plugins::reactions.reaction": existingReactions,
        "api::article.article": [mockRelatedEntity],
      });

      const service = getPluginService<IServiceClient>("client");
      await service.toggle("like", "api::article.article", mockUser, "123", "en", "author-123");

      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction-type");
      expect(global.strapi.documents).toHaveBeenCalledWith("api::article.article");
      expect(global.strapi.documents).toHaveBeenCalledWith("plugins::reactions.reaction");
      
      const documentsMock = global.strapi.documents as unknown as jest.Mock;
      const reactionInstances = documentsMock.mock.results
        .map((result, index) => ({
          uid: documentsMock.mock.calls[index][0],
          instance: result.value,
        }))
        .filter(({ uid }) => uid === "plugins::reactions.reaction");
      
      // Check that delete was called
      const deleteCalls = reactionInstances.flatMap(({ instance }) => 
        (instance.delete as jest.Mock).mock.calls
      );
      expect(deleteCalls).toContainEqual([{ documentId: "reaction-1", locale: "en" }]);
    });
  });
});
