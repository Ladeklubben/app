<!-- +layout.svelte -->
<script lang="ts">
	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import TabBar from "$lib/components/ui/TabBar.svelte";
	import { checkLoginStatus } from "$lib/services/auth";
	import { onMount } from "svelte";
	import { showTabBar } from "$lib/services/layout";
	import { TextZoom } from "@capacitor/text-zoom";
	import { Capacitor } from "@capacitor/core";
	import "../app.css";

	let { children } = $props();
	let loginCheckDone = $state(false);

	// In your app initialization
	if (Capacitor.getPlatform() === "android") {
		TextZoom.set({ value: 0.8 });
	}

	onMount(async () => {
		await checkLoginStatus();
		loginCheckDone = true;
	});
</script>

<ParaglideJS {i18n}>
	<div class="layout-container">
		{#if loginCheckDone}
			<main style={$showTabBar ? "padding-bottom: 70px" : ""}>
				{@render children()}
			</main>
			{#if $showTabBar}
				<TabBar />
			{/if}
		{/if}
	</div>
</ParaglideJS>

<style>
	.layout-container {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		padding-top: env(safe-area-inset-top, 40px);
		padding-bottom: env(safe-area-inset-bottom, 40px);
	}
	main {
		flex: 1;
		overflow-y: auto;
	}
</style>
