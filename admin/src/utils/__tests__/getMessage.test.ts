import getMessage from "../getMessage";

jest.mock("react-intl", () => ({
  useIntl: () => ({
    formatMessage: (x: any, y: any) => ({
      ...x,
      ...y,
    }),
  }),
}));

describe("getMessage()", () => {
  it("should handle simple string", () => {
    expect(getMessage("message.key")).toMatchInlineSnapshot(`
      {
        "defaultMessage": "",
        "id": "reactions.message.key",
      }
    `);
    expect(getMessage("message.key", "message.default")).toMatchInlineSnapshot(`
      {
        "defaultMessage": "message.default",
        "id": "reactions.message.key",
      }
    `);
  });
  it("should handle config object", () => {
    expect(
      getMessage(
        {
          id: "message.key",
        },
        "message.default"
      )
    ).toMatchInlineSnapshot(`
      {
        "defaultMessage": "message.default",
        "id": "reactions.message.key",
      }
    `);
  });
  it("should allow out of scope translates", () => {
    expect(
      getMessage(
        {
          id: "message.key",
        },
        "message.key.default",
        false
      )
    ).toMatchInlineSnapshot(`
      {
        "defaultMessage": "message.key.default",
        "id": "app.components.message.key",
      }
    `);
  });
});
