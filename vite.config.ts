import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		Icons({
			compiler: "svelte",
			autoInstall: true,
		}),
		paraglide({
			project: "./project.inlang",
			outdir: "./src/lib/paraglide",
		}),
	],
});
