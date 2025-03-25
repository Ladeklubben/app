<script lang="ts">
	import { onMount } from "svelte";

	let { 
		align = "center",
		maxValue = 24,
		jump = 1,
	} = $props();

	let container: HTMLDivElement;
	const h = 48; // Height per time unit in pixels
	const cycles = 100; // Number of cycles
	const totalTimeUnits = cycles * maxValue;
	let timeUnits: string[] = [];
	let selectedTime: string = "12"; // Default selected time

	// Generate timeUnits for multiple cycles
	for (let i = 0; i < totalTimeUnits; i += jump) {
		let timeUnit = i % maxValue;
		timeUnits.push(`${timeUnit.toString().padStart(2, "0")}`);
	}

	// Function to update selectedTime based on scroll position
	function updateSelectedTime() {
		const scrollTop = container.scrollTop;
		const timeUnitIndex = Math.round(scrollTop / h) % maxValue; // Mod maxValue to fx get 0-23 with 24
		selectedTime = timeUnits[timeUnitIndex + 1]; // Update selected time unit
	}

	// Scroll handling
	onMount(() => {
		const middleCycleStart = Math.floor(cycles / 2) * maxValue * h / jump;
		container.scrollTop = middleCycleStart;
		updateSelectedTime(); // Set initial selected time unit

		let scrollTimeout: ReturnType<typeof setTimeout> | undefined;

		// Add wheel event listener for custom scrolling
		container.addEventListener(
			"wheel",
			(e: WheelEvent) => {
				e.preventDefault(); // Prevent default scroll behavior

				// Determine scroll direction (up or down)
				const delta = e.deltaY > 0 ? h : -h;
				const newScrollTop = container.scrollTop + delta;

				// Smoothly scroll to the new position
				container.scrollTo({ top: newScrollTop });

				// Debounce rapid scroll events for selectedTime update
				clearTimeout(scrollTimeout);
				scrollTimeout = setTimeout(() => {
					updateSelectedTime(); // Update selected time unit after scrolling stops
				}, 150); // Adjust timeout as needed
			},
			{ passive: false },
		);

		// Add scroll event listener to update selectedTime during other scroll methods (e.g., keyboard)
		container.addEventListener("scroll", () => {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(updateSelectedTime, 150);
		});
	});
</script>

<div bind:this={container} class="h-36 overflow-y-scroll snap-y no-scrollbar w-full">
	{#each timeUnits as timeUnit, i}
		<div
			class="flex items-center text-4xl tabular-nums"
			class:justify-end={align === "right"}
			class:justify-center={align === "center"}
			style="height: {h}px; scroll-snap-align: start;"
		>
			{timeUnit}
		</div>
	{/each}
</div>
