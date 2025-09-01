<!-- +layout.svelte -->
<script lang="ts">
	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import TabBar from "$lib/components/ui/TabBar.svelte";
	import { onMount } from "svelte";
	import { showTabBar } from "$lib/services/layout";
	import { setDevice, device, Platform } from "$lib/services/layout";
	import { page } from "$app/state";
	import Dialog from "$lib/components/ui/Dialog.svelte";
	import "../app.css";
	import { token } from "$lib/services/token";
	import { goto } from "$app/navigation";
	import { User } from "$lib/services/user";

	let { children } = $props();
	let loginCheckDone = $state(false);

	onMount(async () => {
		if (!(await token.isAuthenticated())) goto("/login");
		await User.getInstance().getAllData();
		loginCheckDone = true;
		setDevice();
	});
</script>

<ParaglideJS {i18n}>
	<div class="flex flex-col h-screen">
		{#if loginCheckDone}
			<main
				class="flex-1"
				class:pb-[57px]={$showTabBar && $device === Platform.Android}
				class:pb-[87px]={$showTabBar && $device !== Platform.Android}
				class:pt-10={page.url.pathname !== "/map"}
				class:pt-[env(safe-area-inset-top)]={$device === Platform.IOS && page.url.pathname !== "/map"}
			>
				{@render children()}
			</main>
			{#if $showTabBar}
				<TabBar />
			{/if}
			<Dialog />
		{/if}
	</div>
</ParaglideJS>
