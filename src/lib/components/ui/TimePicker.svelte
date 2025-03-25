<script lang="ts">
	import { onMount } from "svelte";

	let container: HTMLDivElement;
	const h = 48; // Height per hour in pixels
	const cycles = 100; // Number of 24-hour cycles
	const totalHours = cycles * 24;
	let hours = [];
	let selectedHour: string = "12"; // Default selected hour (middle of day)

	// Generate hours for multiple cycles
	for (let i = 0; i < totalHours; i++) {
		let hour = i % 24;
		hours.push(`${hour.toString().padStart(2, "0")}`);
	}

	// Function to update selectedHour based on scroll position
	function updateSelectedHour() {
		const scrollTop = container.scrollTop;
		const hourIndex = Math.round(scrollTop / h) % 24; // Mod 24 to get 0-23
		selectedHour = hours[hourIndex + 1]; // Update selected hour
	}

	// Scroll handling
	onMount(() => {
		const middleCycleStart = Math.floor(cycles / 2) * 24 * h;
		container.scrollTop = middleCycleStart;
		updateSelectedHour(); // Set initial selected hour

		let scrollTimeout: number | undefined;

		// Add wheel event listener for custom scrolling
		container.addEventListener(
			"wheel",
			(e: WheelEvent) => {
				e.preventDefault(); // Prevent default scroll behavior

				// Determine scroll direction (up or down)
				const delta = e.deltaY > 0 ? h : -h;
				const newScrollTop = container.scrollTop + delta;

				// Smoothly scroll to the new position
				container.scrollTo({ top: newScrollTop});

				// Debounce rapid scroll events for selectedHour update
				clearTimeout(scrollTimeout);
				scrollTimeout = setTimeout(() => {
					updateSelectedHour(); // Update selected hour after scrolling stops
				}, 150); // Adjust timeout as needed
			},
			{ passive: false }
		);

		// Add scroll event listener to update selectedHour during other scroll methods (e.g., keyboard)
		container.addEventListener("scroll", () => {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(updateSelectedHour, 150);
		});
	});
</script>

<div bind:this={container} class="container">
	{#each hours as hour, i}
		<div class="hour" style="height: {h}px; scroll-snap-align: start;">{hour}</div>
	{/each}
</div>

<!-- Display the selected hour -->
<div>Selected Hour: {selectedHour}</div>

<style>
	.container {
		height: 140px; /* Fixed height to show a few hours */
		overflow-y: scroll;
		scroll-snap-type: y mandatory; /* Enables snapping on vertical scroll */
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE and Edge */
	}
	.container::-webkit-scrollbar {
		display: none; /* Hide WebKit (Chrome, Safari, etc.) scrollbar */
	}
	.hour {
		display: flex;
		align-items: center;
		justify-content: center; /* Center the hour text */
		font-size: 32px;
		font-variant-numeric: tabular-nums;
	}
</style>