<!-- Subpage.svelte -->
<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { showTabBar } from "$lib/services/layout";
	interface Props {
		title?: string; // Title for the subpage header
		children?: import("svelte").Snippet;
	}

	let { title = "", children }: Props = $props();

	function goBack() {
		// Navigate back to the previous page
		history.back();
	}

	onMount(() => {
		$showTabBar = false;
	});

	onDestroy(() => {
		$showTabBar = true;
	});
</script>

<header class="flex items-center py-0 px-2.5 border-b border-b-lk-blue-800 relative">
	<button
		class="bg-none border-0 cursor-pointer pt-2.5 pr-5 pb-[18px] pl-2.5 text-lk-blue-50 text-2xl"
		onclick={goBack}
		aria-label="Go back"
	>
		‹
	</button>
	<h1 class="m-0 text-xl absolute left-1/2 -translate-x-1/2">{title}</h1>
</header>
<div class="wrapper">
	{@render children?.()}
</div>
