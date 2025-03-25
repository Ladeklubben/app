<script lang="ts">
	import { onMount } from "svelte";

	// Add export prop for binding
	export let selectedHour: string = "00";

	let container: HTMLDivElement;
	const h = 48; // Height per hour in pixels
	const cycles = 100; // Number of 24-hour cycles
	const totalHours = cycles * 24;
	let hours = [];

	// Generate hours for multiple cycles
	for (let i = 0; i < totalHours; i++) {
		let hour = i % 24;
		hours.push(`${hour.toString().padStart(2, "0")}`);
	}

	function handleScroll() {
		if (!container) return;

		// Calculate the center position
		const containerMiddle = container.offsetHeight / 2;
		const scrollTop = container.scrollTop;

		// Find which hour is closest to center
		const centerIndex = Math.round(scrollTop / h);
		const hour = hours[centerIndex+1];

		// Update the selected hour only if it changed
		if (hour !== selectedHour) {
			selectedHour = hour;
		}
	}

	// Set initial scroll position to the middle on mount
	onMount(() => {
		const middleCycleStart = Math.floor(cycles / 2) * 24 * h;
		container.scrollTop = middleCycleStart;
		handleScroll(); // Initialize selected hour
	});
</script>

<div bind:this={container} class="container" on:scroll={handleScroll}>
	{#each hours as hour, i}
		<div class="hour" style="height: {h}px; scroll-snap-align: start;">{hour}</div>
	{/each}
	
</div>
Selected hour: {selectedHour}

<style>
	.container {
		height: 140px; /* Fixed height to show a few hours */
		overflow-y: scroll;
		scroll-snap-type: y mandatory; /* Enables snapping on vertical scroll */
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		&::-webkit-scrollbar {
			display: none; /* Hide WebKit (Chrome, Safari, etc.) scrollbar */
		}
	}
	.hour {
		display: flex;
		align-items: center;
		justify-content: center; /* Center the hour text */
		font-size: 32px;
		font-variant-numeric: tabular-nums;
	}
</style>
