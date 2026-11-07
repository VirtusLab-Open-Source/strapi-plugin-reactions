import { reactionForm } from '../../../../../schemas';
import { getFormErrors } from '../utils';

const validate = (payload: object) => {
  const { error } = reactionForm.safeParse(payload);
  return getFormErrors(error?.issues);
};

describe('getFormErrors()', () => {
  it('should map an empty form to translation keys of required fields', () => {
    expect(validate({ image: null, emoji: null, emojiFallbackUrl: null })).toEqual({
      name: 'page.settings.form.name.required',
      slug: 'page.settings.form.slug.required',
    });
  });

  it('should require an icon or emoji when name and slug are given', () => {
    expect(validate({ name: 'Like', slug: 'like', emoji: null })).toEqual({
      icon: 'page.settings.form.icon.required',
      emoji: 'page.settings.form.emoji.required',
    });
  });

  it('should return no errors for a valid form', () => {
    expect(validate({ name: 'Like', slug: 'like', emoji: '👍' })).toEqual({});
  });
});
