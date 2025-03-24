<script>
	import { onMount } from "svelte";

	let container;
	const h = 48; // Height per hour in pixels
	const cycles = 100; // Number of 24-hour cycles
	const totalHours = cycles * 24;
	let hours = [];

	// Generate hours for multiple cycles
	for (let i = 0; i < totalHours; i++) {
		let hour = i % 24;
		hours.push(`${hour.toString().padStart(2, "0")}`);
	}

	// Set initial scroll position to the middle on mount
	onMount(() => {
		const middleCycleStart = Math.floor(cycles / 2) * 24 * h;
		container.scrollTop = middleCycleStart;
	});
</script>

<div bind:this={container} class="container">
	{#each hours as hour, i}
		<div class="hour" style="height: {h}px; scroll-snap-align: start;">{hour}</div>
	{/each}
</div>

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
	}
</style>
