import { sanitizeReactionEntity, sanitizeReactionUser } from '../../../src/services/utils/functions';

beforeEach(() => {
  Object.defineProperty(global, 'strapi', {
    value: {
      log: {
        warn: jest.fn(),
      },
    },
    writable: true,
  });
});

describe('sanitizeReactionUser', () => {
  it('filters blocked user properties', () => {
    expect(
      sanitizeReactionUser(
        {
          documentId: 'abc',
          username: 'joe',
          email: 'joe@example.com',
        },
        ['email'],
      ),
    ).toEqual({
      documentId: 'abc',
      username: 'joe',
    });
  });

  it('returns user unchanged when no properties are blocked', () => {
    const user = {
      documentId: 'abc',
      username: 'joe',
    };

    expect(sanitizeReactionUser(user, [])).toEqual(user);
  });

  it('returns nullish and non-object users unchanged', () => {
    expect(sanitizeReactionUser(null, ['email'])).toBeNull();
    expect(sanitizeReactionUser(undefined, ['email'])).toBeUndefined();
  });

  it('returns empty object when all user fields are filtered out', () => {
    const user = {
      email: 'joe@example.com',
      username: 'joe',
    };

    expect(sanitizeReactionUser(user, ['email', 'username'])).toEqual({});
    expect(strapi.log.warn).toHaveBeenCalledWith(
      'Strapi Reactions Plugin:You filtered out all of users properties, so the user is empty object',
    );
  });
});

describe('sanitizeReactionEntity', () => {
  it('sanitizes nested user object', () => {
    expect(
      sanitizeReactionEntity(
        {
          documentId: 'reaction-1',
          user: {
            documentId: 'user-1',
            username: 'joe',
            email: 'joe@example.com',
          },
        } as any,
        ['email', 'username'],
      ),
    ).toEqual({
      documentId: 'reaction-1',
      user: {
        documentId: 'user-1',
      },
    });
  });

  it('preserves userId for anonymous reactions', () => {
    expect(
      sanitizeReactionEntity(
        {
          documentId: 'reaction-1',
          userId: 'anonymous-123',
          user: null,
        } as any,
        ['email'],
      ),
    ).toEqual({
      documentId: 'reaction-1',
      userId: 'anonymous-123',
      user: null,
    });
  });

  it('preserves entity when user is not an object', () => {
    const entity = {
      documentId: 'reaction-1',
      user: 'legacy-user-id',
    } as any;

    expect(sanitizeReactionEntity(entity, ['email'])).toEqual(entity);
  });

  it('returns entity with empty user when all user fields are filtered out', () => {
    const entity = {
      documentId: 'reaction-1',
      user: {
        email: 'joe@example.com',
        username: 'joe',
      },
    } as any;

    expect(sanitizeReactionEntity(entity, ['email', 'username'])).toEqual({
      documentId: 'reaction-1',
      user: {},
    });
    expect(strapi.log.warn).toHaveBeenCalledWith(
      'Strapi Reactions Plugin:You filtered out all of users properties, so the user is empty object',
    );
  });
});
