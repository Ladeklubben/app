<!-- +layout.svelte -->
<script lang="ts">
	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import TabBar from "$lib/components/ui/TabBar.svelte";
	import { checkLoginStatus } from "$lib/services/auth";
	import { onMount } from "svelte";
	import { showTabBar } from "$lib/services/layout";
	import { setDevice, device, Platform } from "$lib/services/layout";
	import { page } from "$app/stores";
	import "../app.css";

	let { children } = $props();
	let loginCheckDone = $state(false);

	onMount(async () => {
		await checkLoginStatus();
		loginCheckDone = true;
		setDevice();
	});
</script>

<ParaglideJS {i18n}>
	<div
		class="flex flex-col h-screen"
		class:pb-[env(safe-area-inset-bottom,40px)]={$device === Platform.IOS}
	>
		{#if loginCheckDone}
			<main
				class="flex-1 overflow-auto"
				class:pb-19={$device === Platform.Android && $showTabBar}
				class:pb-18={($device === Platform.Web || $device === Platform.IOS) && $showTabBar}
				class:mt-10={$device !== Platform.Web && $page.url.pathname !== "/map"}
			>
				{@render children()}
			</main>
			{#if $showTabBar}
				<TabBar />
			{/if}
		{/if}
	</div>
</ParaglideJS>
