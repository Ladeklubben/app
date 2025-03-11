<!-- +layout.svelte -->
<script lang="ts">
	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import TabBar from "$lib/components/ui/TabBar.svelte";
	import { checkLoginStatus } from "$lib/services/auth";
	import { onMount } from "svelte";
	import { showTabBar } from "$lib/services/layout";
	import { setDevice, device } from "$lib/services/layout";
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
		class="flex flex-col min-h-full"
		class:pt-[env(safe-area-inset-top,40px)]={$device.isIOS}
		class:pb-[env(safe-area-inset-bottom,40px)]={$device.isIOS}
	>
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
