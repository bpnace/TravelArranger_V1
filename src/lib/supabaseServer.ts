import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';

export const supabaseServer = createServerClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  {
    cookies: {
      get: (key) => undefined,
      set: (key, value, options) => undefined,
      remove: (key, options) => undefined
    }
  }
);

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get: (key) => event.cookies.get(key),
        set: (key, value, options) => {
          event.cookies.set(key, value, { ...options, path: '/' });
        },
        remove: (key, options) => {
          event.cookies.set(key, '', { ...options, path: '/', maxAge: 0 });
        }
      }
    }
  );

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
}; 