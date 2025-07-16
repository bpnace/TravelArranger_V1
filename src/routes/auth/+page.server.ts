import { z } from 'zod';
import type { Actions } from './$types';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const form = Object.fromEntries(await request.formData());
    const result = authSchema.safeParse(form);
    if (!result.success) {
      return { success: false, errors: result.error.flatten().fieldErrors };
    }
    const { email, password } = result.data;
    const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, errors: { auth: [error.message] } };
    }
    return { success: true, user: data.user };
  },
  signup: async ({ request, locals }) => {
    const form = Object.fromEntries(await request.formData());
    const result = authSchema.safeParse(form);
    if (!result.success) {
      return { success: false, errors: result.error.flatten().fieldErrors };
    }
    const { email, password } = result.data;
    const { data, error } = await locals.supabase.auth.signUp({ email, password });
    if (error) {
      return { success: false, errors: { auth: [error.message] } };
    }
    return { success: true, user: data.user };
  }
}; 