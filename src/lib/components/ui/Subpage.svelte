<!-- Subpage.svelte -->
<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { showTabBar } from "$lib/services/layout";
	import { bottomButtonFixed } from "$lib/services/layout";
	import { goto } from "$app/navigation";
	import ChevronLeft from "~icons/mdi/chevron-left";

	let { title = "", backURL="", children } = $props();

	function goBack() {
		// Navigate back to the previous page
		if (backURL !== "") {
			goto(backURL);
		} else {
			history.back();
		}
	}

	onMount(() => {
		$showTabBar = false;

		// Bottom button fixed state
		if (typeof window !== "undefined") {
			checkHeight();
			window.addEventListener("resize", checkHeight);
		}
	});

	onDestroy(() => {
		$showTabBar = true;

		// Cleanup button fixed state
		if (typeof window !== "undefined") {
			window.removeEventListener("resize", checkHeight);
		}
	});

	// Check height on mount and resize
	// If the page is shorter than the screen height, the bottom button should be fixed
	// This only works if the page has a div with the id "height-check". The button should not be inside this div
	function checkHeight() {
		const heightCheckDiv = document.getElementById("height-check");
		if (heightCheckDiv) {
			const pageHeight = heightCheckDiv.offsetHeight;
			const screenHeight = window.innerHeight;
			$bottomButtonFixed = screenHeight > pageHeight + 220;
		}
	}
</script>

<header class="flex items-center py-0 px-2.5 border-b border-b-lk-blue-800 relative">
	<button
		class="bg-none border-0 cursor-pointer px-2 py-3 text-lk-blue-50 text-2xl"
		onclick={goBack}
		aria-label="Go back"
	>
		<ChevronLeft font-size={20}/>
	</button>
	<h1 class="m-0 text-xl absolute left-1/2 -translate-x-1/2">{title}</h1>
</header>
<div class="wrapper">
	{@render children?.()}
</div>
