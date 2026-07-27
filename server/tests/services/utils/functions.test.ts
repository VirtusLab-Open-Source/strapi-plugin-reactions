import { sanitizeReactionEntity, sanitizeReactionUser } from '../../../src/services/utils/functions';

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

  it('returns original user when every property is blocked', () => {
    const user = { email: 'joe@example.com' };

    expect(sanitizeReactionUser(user, ['email'])).toBe(user);
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
});
