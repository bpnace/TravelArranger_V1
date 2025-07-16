import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), '');
	
	console.log('Environment variables loaded:');
	console.log('PUBLIC_SUPABASE_URL:', env.PUBLIC_SUPABASE_URL);
	console.log('PUBLIC_SUPABASE_ANON_KEY:', env.PUBLIC_SUPABASE_ANON_KEY ? '***FOUND***' : 'undefined');
	
	return {
		plugins: [sveltekit()],
		define: {
			'process.env.PUBLIC_SUPABASE_URL': JSON.stringify(env.PUBLIC_SUPABASE_URL),
			'process.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.PUBLIC_SUPABASE_ANON_KEY)
		}
	};
});
