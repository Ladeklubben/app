<script lang="ts">
	import { fade } from "svelte/transition";
	interface Props {
		description: string;
		stat: string;
		unit: string;
	}

	let { description, stat, unit }: Props = $props();
</script>

<div
	class="p-6 items-center rounded-2xl border border-lk-blue-800"
	style="background: linear-gradient(to right, #59a6b7, #2e4d59);"
>
	<span in:fade={{ duration: 300 }} class="flex flex-col text-center gap-3">
		{description}
		<!-- prettier-ignore -->
		<h2 class="text-6xl/12 font-bold text-lk-blue-100 spacing -mb-2">
			{stat}<span class="text-base font-medium pl-1">{unit}</span>
		</h2>
	</span>
</div>
