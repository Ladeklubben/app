<script lang="ts">
	import Dots from "~icons/mdi/dots-horizontal";
	let { children, title, dotsPath = "" } = $props();
</script>

<div class="flex flex-col gap-5 p-5 rounded-2xl border border-lk-blue-800">
	<div class="flex flex-row justify-between items-center">
		<h1 class="text-lk-blue-50 text-2xl m-0 font-black">{title}</h1>
		{#if dotsPath}
			<a href={dotsPath}>
				<Dots class="text-lk-blue-50 text-2xl" />
			</a>
		{/if}
	</div>
	{@render children?.()}
</div>
