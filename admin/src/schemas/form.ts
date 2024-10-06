import { z } from 'zod';

export type ReactionForm = z.infer<typeof reactionForm>;
export const reactionForm = z.object({
  name: z.string({
    required_error: "page.settings.form.name.required",
  }),
  slug: z.string({
    required_error: "page.settings.form.slug.required",
  }),
  icon: z.object({
    url: z.string(),
  }).refine((data) => data.url).nullable().optional(),
  emoji: z.string().nullable().optional(),
})
.superRefine((data, ctx) => {
  const emojiDefined = data.icon || data.emoji;
  if (!emojiDefined) {
    if (!data.emoji) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emoji"],
        message: "page.settings.form.emoji.required",
      });
    }
    if (!data.icon) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["icon"],
        message: "page.settings.form.icon.required",
      });
    }
  }
  return z.NEVER;
});
