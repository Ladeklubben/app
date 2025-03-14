<script lang="ts">
	let { totalDots = 5, activeDot = 1 } = $props();
</script>

<div class="flex w-full gap-2 justify-center">
	{#each Array(totalDots).fill(0) as _, index}
		<div
			class="w-2 h-2 rounded-full"
			class:bg-lk-blue-800={index !== activeDot - 1}
			class:bg-lk-blue-500={index === activeDot - 1}
		></div>
	{/each}
</div>
