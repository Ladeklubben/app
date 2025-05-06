<script lang="ts">
	import { onMount } from "svelte";

	let {
		align = "center",
		maxValue = 24,
		jump = 1,
		selectedTime = $bindable(),
		small = false,
	} = $props();

	let container: HTMLDivElement;
	const h = small ? 32 : 48; // Height per time unit in pixels
	const cycles = 100; // Number of cycles
	const totalTimeUnits = cycles * maxValue;
	let timeUnits: string[] = [];

	// Store the initial selectedTime value
	const initialSelectedTime = selectedTime ? parseInt(selectedTime, 10) : 12;

	// Generate timeUnits for multiple cycles
	for (let i = 0; i < totalTimeUnits; i += jump) {
		let timeUnit = i % maxValue;
		timeUnits.push(`${timeUnit.toString().padStart(2, "0")}`);
	}

	// Function to update selectedTime based on scroll position
	function updateSelectedTime() {
		const scrollTop = container.scrollTop;
		const timeUnitIndex = Math.round(scrollTop / h) % maxValue;
		selectedTime = timeUnits[timeUnitIndex + 1];
	}

	// Scroll handling
	onMount(() => {
		const middleCycleStart = (Math.floor(cycles / 2) * maxValue * h) / jump - h;
		// Use the initialSelectedTime instead of defaultTime
		container.scrollTop = middleCycleStart + h * Math.round(initialSelectedTime / jump);
		updateSelectedTime();

		let scrollTimeout: ReturnType<typeof setTimeout> | undefined;

		const wheelHandler = (e: WheelEvent) => {
			e.preventDefault();
			const delta = e.deltaY > 0 ? h : -h;
			const newScrollTop = container.scrollTop + delta;
			container.scrollTo({ top: newScrollTop });
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => {
				updateSelectedTime();
			}, 150);
		};

		const scrollHandler = () => {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(updateSelectedTime, 150);
		};

		container.addEventListener("wheel", wheelHandler, { passive: false });
		container.addEventListener("scroll", scrollHandler);

		// Clean up event listeners when component is destroyed
		return () => {
			container.removeEventListener("wheel", wheelHandler);
			container.removeEventListener("scroll", scrollHandler);
		};
	});
</script>

<div
	bind:this={container}
	class="{small ? 'h-24' : 'h-36'} overflow-y-scroll snap-y no-scrollbar w-full"
	style="mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 40%,
        black 60%,
        transparent 100%
    ); -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 50%,
        black 50%,
        transparent 100%
    );"
>
	{#each timeUnits as timeUnit, i}
		<div
			class="flex items-center {small ? 'text-2xl' : 'text-4xl'} font-medium tabular-nums"
			class:justify-end={align === "right"}
			class:justify-center={align === "center"}
			style="height: {h}px; scroll-snap-align: start;"
		>
			{timeUnit}
		</div>
	{/each}
</div>
